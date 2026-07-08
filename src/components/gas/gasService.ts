import { ethers } from "ethers";
import rstruther from "@/infraestructure/http/nodeApi";
import { getSigningWallet } from "../wallet/walletStorage";
import { getProvider, WalletNetworkKey } from "../wallet/walletProviders";

export interface GasSponsorResult {
  txid: string;
  amount: string; // ex: "0.01" POL
  symbol: string; // "POL" ou "XPL"
  estimatedArrival: number; // segundos estimados para o gas chegar
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

// Limite mínimo de gas nativo para disparar o pedido (em ETH/POL/XPL)
export const GAS_THRESHOLD: Record<WalletNetworkKey, string> = {
  polygon: "0.08", // 0.01 POL
  plasma: "0.01", // 0.01 XPL
};

/**
 * Verifica se o saldo nativo está abaixo do threshold de gas.
 * Se sim, retorna true e o app deve mostrar o botão de gas patrocinado.
 */
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

/**
 * Solicita gas patrocinado ao backend.
 *
 * Fluxo:
 * 1. Monta mensagem com endereço + timestamp + nonce (anti-replay)
 * 2. Assina localmente com a chave privada (sem gas — só criptografia)
 * 3. Envia endereço + assinatura + timestamp ao backend
 * 4. Backend verifica assinatura, saldo USDT e cooldown antes de enviar gas
 */
export async function requestGasSponsorship(
  network: WalletNetworkKey,
): Promise<GasSponsorResult> {
  // 1. Obtém a wallet de assinatura local
  const wallet = await getSigningWallet();
  if (!wallet) {
    throw new GasSponsorError(
      "Carteira não encontrada. Esta função só está disponível em carteiras geradas pelo app.",
      "NO_WALLET",
    );
  }

  // 2. Monta a mensagem com timestamp atual (segundos) como nonce
  //    O backend rejeita mensagens com mais de 5 minutos
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = `${wallet.address.toLowerCase()}:${timestamp}:gas-request:${network}`;

  // 3. Assina a mensagem localmente — zero custo, só criptografia
  //    ethers.signMessage adiciona o prefixo "\x19Ethereum Signed Message:\n"
  //    automaticamente (padrão EIP-191)
  const signature = await wallet.signMessage(nonce);

  // 4. Envia ao backend
  try {
    const response = await rstruther.post("gas/request", {
      address: wallet.address,
      network: network.toUpperCase(),
      timestamp,
      signature,
    });

    const res = response.data?.data?.res;
    if (!res) {
      throw new GasSponsorError("Resposta inesperada do servidor.", "REJECTED");
    }

    return {
      txid: res.txid,
      amount: res.amount,
      symbol: res.symbol,
      estimatedArrival: res.estimatedArrival ?? 15,
    };
  } catch (error: any) {
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;

    if (code === "COOLDOWN") {
      throw new GasSponsorError(
        message ??
          "Você já solicitou gas recentemente. Aguarde antes de solicitar novamente.",
        "COOLDOWN",
      );
    }
    if (code === "LOW_BALANCE") {
      throw new GasSponsorError(
        message ?? "Saldo de USDT insuficiente para solicitar gas patrocinado.",
        "LOW_BALANCE",
      );
    }
    if (code === "ALREADY_ENOUGH") {
      throw new GasSponsorError(
        message ?? "Você já tem gas suficiente nesta rede.",
        "ALREADY_ENOUGH",
      );
    }

    if (error instanceof GasSponsorError) throw error;

    throw new GasSponsorError(
      "Não foi possível solicitar gas patrocinado. Tente novamente.",
      "REJECTED",
    );
  }
}

/**
 * Após receber o gas, executa o approve on-chain e notifica o backend
 * para resgatar os 0.5 USDT via transferFrom imediatamente.
 *
 * Fluxo:
 * 1. App faz approve(hotWallet, 0.5 USDT) on-chain
 * 2. App notifica POST gas/collect
 * 3. Backend verifica allowance e chama transferFrom
 */
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

  // 1. Approve on-chain
  const approveTx = await usdtContract.approve(backendAddress, amount);
  await approveTx.wait();

  // 2. Notifica backend para resgatar via transferFrom
  const response = await rstruther.post("gas/collect", {
    address: wallet.address,
    network: network.toUpperCase(),
  });

  return { approveTxid: approveTx.hash };
}
