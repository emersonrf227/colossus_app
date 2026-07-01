import { ethers } from "ethers";

// Configuração de blockchain por rede suportada pela wallet.
// IMPORTANTE: troque os placeholders abaixo pelos seus RPC endpoints
// reais (Alchemy/Infura/QuickNode/RPC próprio) e pelo endereço real do
// contrato USDT em cada rede antes de usar em produção.

export type WalletNetworkKey = "polygon" | "plasma";

interface NetworkConfig {
  key: WalletNetworkKey;
  label: string;
  chainId: number;
  rpcUrl: string;
  nativeCurrencySymbol: string; // moeda nativa para pagar taxa de gás
  usdtContractAddress: string;
  explorerTxUrl: (txid: string) => string;
}

export const WALLET_NETWORKS: Record<WalletNetworkKey, NetworkConfig> = {
  polygon: {
    key: "polygon",
    label: "Polygon",
    chainId: 137,
    rpcUrl:
      "https://polygon.blockpi.network/v1/rpc/cd94efee8a3c6fa8ce9cd47e58d959e919486c9d",
    nativeCurrencySymbol: "POL",
    usdtContractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    explorerTxUrl: (txid) => `https://polygonscan.com/tx/${txid}`,
  },
  plasma: {
    key: "plasma",
    label: "Plasma",
    // 👉 Preencha com o chainId real da rede Plasma.
    chainId: 9745,
    // 👉 Troque pelo seu endpoint real para a rede Plasma.
    rpcUrl: "https://rpc.plasma.to",
    nativeCurrencySymbol: "XPL",
    // 👉 Endereço do contrato USDT na rede Plasma — confirme antes de usar.
    usdtContractAddress: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
    explorerTxUrl: (txid) => `https://plasmascan.to/tx/${txid}`,
  },
};

// ABI mínima de um token ERC20 — só as funções que realmente usamos
// (saldo, decimais, transferência). Não precisamos da ABI completa.
export const ERC20_MIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

// Cache de providers por rede, para não recriar a conexão RPC a cada
// chamada — ethers.JsonRpcProvider mantém estado interno (nonce cache,
// etc) que vale reaproveitar entre chamadas na mesma sessão do app.
const providerCache: Partial<Record<WalletNetworkKey, ethers.JsonRpcProvider>> =
  {};

export function getProvider(
  networkKey: WalletNetworkKey,
): ethers.JsonRpcProvider {
  if (!providerCache[networkKey]) {
    const config = WALLET_NETWORKS[networkKey];
    providerCache[networkKey] = new ethers.JsonRpcProvider(
      config.rpcUrl,
      config.chainId,
    );
  }
  return providerCache[networkKey]!;
}

export function getNetworkConfig(networkKey: WalletNetworkKey): NetworkConfig {
  return WALLET_NETWORKS[networkKey];
}

export const ALL_WALLET_NETWORKS: WalletNetworkKey[] = ["polygon", "plasma"];
