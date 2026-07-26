import { ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import helmApi from "@/infraestructure/http/nodeApi";
import { getSigningWallet } from "../wallet/walletStorage";
import { getProvider, WalletNetworkKey } from "../wallet/walletProviders";

export interface GasSponsorResult {
  txid: string;
  amount: string;
  symbol: string;
  estimatedArrival: number;
}

export class GasSponsorError extends Error {
  constructor(
    message: string,
    public code?:
      | "NO_WALLET"
      | "LOW_BALANCE"
      | "COOLDOWN"
      | "ALREADY_ENOUGH"
      | "REJECTED",
  ) {
    super(message);
    this.name = "GasSponsorError";
  }
}

// ─── Flag de sessão pendente ──────────────────────────────────────────────
// Salva no AsyncStorage que o gas foi recebido mas o approve ainda não foi
// executado. Se o app fechar no meio do processo, ao reabrir essa flag
// estará presente e o fluxo de approve pode ser retomado.

const GAS_PENDING_KEY = "gas_sponsor_pending";

interface GasPendingSession {
  network: WalletNetworkKey;
  backendAddress: string;
  gasTxid: string;
  estimatedArrival: number;
  startedAt: number; // timestamp unix
}

export async function getGasPendingSession(): Promise<GasPendingSession | null> {
  try {
    const raw = await AsyncStorage.getItem(GAS_PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GasPendingSession;
  } catch {
    return null;
  }
}

async function setGasPendingSession(session: GasPendingSession): Promise<void> {
  await AsyncStorage.setItem(GAS_PENDING_KEY, JSON.stringify(session));
}

export async function clearGasPendingSession(): Promise<void> {
  await AsyncStorage.removeItem(GAS_PENDING_KEY);
}

// ─── Threshold de gas ────────────────────────────────────────────────────

export const GAS_THRESHOLD: Record<WalletNetworkKey, string> = {
  polygon: "0.08",
  plasma: "0.01",
};

/**
 * Saldo mínimo de USDT na rede para o gás patrocinado ser oferecido.
 *
 * O approve reserva parte do saldo para o backend resgatar via
 * transferFrom, então abaixo desse valor o fluxo terminaria em
 * LOW_BALANCE — melhor não oferecer.
 */
export const MIN_USDT_FOR_GAS = 1;

export async function needsGasSponsorship(
  address: string,
  network: WalletNetworkKey,
): Promise<boolean> {
  try {
    const provider = getProvider(network);
    const balance = await provider.getBalance(address);
    const threshold = ethers.parseEther(GAS_THRESHOLD[network]);
    return balance < threshold;
  } catch {
    return false;
  }
}

// ─── Solicitação de gas ───────────────────────────────────────────────────

export async function requestGasSponsorship(
  network: WalletNetworkKey,
  backendAddress: string,
): Promise<GasSponsorResult> {
  const wallet = await getSigningWallet();
  if (!wallet) {
    throw new GasSponsorError("Carteira não encontrada.", "NO_WALLET");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = `${wallet.address.toLowerCase()}:${timestamp}:gas-request:${network}`;
  const signature = await wallet.signMessage(nonce);

  try {
    const response = await helmApi.post("gas/request", {
      address: wallet.address,
      network: network.toUpperCase(),
      timestamp,
      signature,
    });

    const res = response.data?.data?.res;
    if (!res)
      throw new GasSponsorError("Resposta inesperada do servidor.", "REJECTED");

    const result: GasSponsorResult = {
      txid: res.txid,
      amount: res.amount,
      symbol: res.symbol,
      estimatedArrival: res.estimatedArrival ?? 15,
    };

    // ✅ Gas confirmado pelo backend — salva a flag de sessão pendente.
    // A partir daqui o approve DEVE acontecer. Se o app fechar, ao reabrir
    // a tela verifica getGasPendingSession() e retoma daqui.
    await setGasPendingSession({
      network,
      backendAddress,
      gasTxid: result.txid,
      estimatedArrival: result.estimatedArrival,
      startedAt: timestamp,
    });

    return result;
  } catch (error: any) {
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;

    if (code === "COOLDOWN")
      throw new GasSponsorError(
        message ?? "Você já solicitou gas recentemente.",
        "COOLDOWN",
      );
    if (code === "LOW_BALANCE")
      throw new GasSponsorError(
        message ?? "Saldo de USDT insuficiente.",
        "LOW_BALANCE",
      );
    if (code === "ALREADY_ENOUGH")
      throw new GasSponsorError(
        message ?? "Você já tem gas suficiente nesta rede.",
        "ALREADY_ENOUGH",
      );
    if (error instanceof GasSponsorError) throw error;

    throw new GasSponsorError(
      "Não foi possível solicitar gas patrocinado. Tente novamente.",
      "REJECTED",
    );
  }
}

// ─── Approve + Coleta ─────────────────────────────────────────────────────

export async function approveAndCollect(
  network: WalletNetworkKey,
  backendAddress: string,
  amountUsdt: string = "0.5",
): Promise<{ approveTxid: string }> {
  const wallet = await getSigningWallet();
  if (!wallet)
    throw new GasSponsorError("Carteira não encontrada.", "NO_WALLET");

  const provider = getProvider(network);
  const connected = wallet.connect(provider);
  const { getNetworkConfig, ERC20_MIN_ABI } =
    await import("./../../components/wallet/walletProviders");
  const config = getNetworkConfig(network);

  const usdtContract = new ethers.Contract(
    config.usdtContractAddress,
    [
      ...ERC20_MIN_ABI,
      "function approve(address spender, uint256 amount) returns (bool)",
    ],
    connected,
  );

  const decimals = await usdtContract.decimals();
  const amount = ethers.parseUnits(amountUsdt, decimals);

  // Approve on-chain
  const approveTx = await usdtContract.approve(backendAddress, amount);
  await approveTx.wait();

  // Notifica backend para resgatar via transferFrom
  await helmApi.post("gas/collect", {
    address: wallet.address,
    network: network.toUpperCase(),
  });

  // ✅ Approve concluído — remove a flag de sessão pendente.
  // A partir daqui o backend já tem o allowance e pode resgatar.
  await clearGasPendingSession();

  return { approveTxid: approveTx.hash };
}

// ─── Retomada de sessão pendente ─────────────────────────────────────────

/**
 * Verifica se existe uma sessão de gas pendente (app fechou antes do approve).
 * Deve ser chamado ao montar o GasSponsorModal ou o WalletHome.
 *
 * Se retornar uma sessão, exibe o modal direto no estado "approving"
 * e chama approveAndCollect com os dados salvos.
 *
 * Exemplo de uso no WalletHome:
 *
 *   useEffect(() => {
 *     getGasPendingSession().then((session) => {
 *       if (session) setShowGasModal(true); // modal abre já no passo correto
 *     });
 *   }, []);
 */
