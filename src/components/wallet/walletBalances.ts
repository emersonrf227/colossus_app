import { ethers } from "ethers";
import {
  getProvider,
  getNetworkConfig,
  ERC20_MIN_ABI,
  WalletNetworkKey,
  ALL_WALLET_NETWORKS,
} from "./walletProviders";

export interface NetworkBalance {
  network: WalletNetworkKey;
  usdtBalance: string; // já formatado (ex: "125.50")
  nativeBalance: string; // moeda nativa, formatada (ex: "0.0042")
  nativeCurrencySymbol: string;
  /** true quando o saldo nativo é baixo demais para pagar gás de uma
   *  transação simples — usado para avisar o usuário antes de tentar
   *  um saque que provavelmente vai falhar por falta de gás. */
  lowGasWarning: boolean;
}

// Limiar conservador "baixo" de saldo nativo — abaixo disso, avisamos o
// usuário que pode não haver gás suficiente. É uma heurística simples,
// não um cálculo exato de gas price (que varia a cada bloco).
const LOW_GAS_THRESHOLD = 0.001;

export class BalanceFetchError extends Error {
  constructor(
    public readonly network: WalletNetworkKey,
    message = "Não foi possível consultar o saldo.",
  ) {
    super(message);
    this.name = "BalanceFetchError";
  }
}

async function fetchSingleNetworkBalance(
  address: string,
  networkKey: WalletNetworkKey,
): Promise<NetworkBalance> {
  const provider = getProvider(networkKey);
  const config = getNetworkConfig(networkKey);

  try {
    const usdtContract = new ethers.Contract(
      config.usdtContractAddress,
      ERC20_MIN_ABI,
      provider,
    );

    const [usdtRaw, decimals, nativeRaw] = await Promise.all([
      usdtContract.balanceOf(address),
      usdtContract.decimals(),
      provider.getBalance(address),
    ]);

    const usdtBalance = ethers.formatUnits(usdtRaw, decimals);
    const nativeBalance = ethers.formatEther(nativeRaw);

    return {
      network: networkKey,
      usdtBalance,
      nativeBalance,
      nativeCurrencySymbol: config.nativeCurrencySymbol,
      lowGasWarning: parseFloat(nativeBalance) < LOW_GAS_THRESHOLD,
    };
  } catch (error) {
    throw new BalanceFetchError(networkKey);
  }
}

/**
 * Consulta o saldo (USDT + moeda nativa) do endereço em todas as redes
 * suportadas, em paralelo. Redes que falharem individualmente não
 * derrubam as demais — cada uma reporta seu próprio erro.
 */
export async function fetchAllNetworkBalances(
  address: string,
): Promise<{ balances: NetworkBalance[]; errors: BalanceFetchError[] }> {
  const results = await Promise.allSettled(
    ALL_WALLET_NETWORKS.map((network) =>
      fetchSingleNetworkBalance(address, network),
    ),
  );

  const balances: NetworkBalance[] = [];
  const errors: BalanceFetchError[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      balances.push(result.value);
    } else {
      errors.push(result.reason);
    }
  });

  return { balances, errors };
}
