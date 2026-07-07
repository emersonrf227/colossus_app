import axios from "axios";

// 👉 Crie sua API Key em etherscan.io/apidashboard (gratuita)
// Uma única key funciona para todas as redes no V2
const ETHERSCAN_API_KEY = "UMQVVTRJNZCAIXGYYSA9M7Q1YB58BUTD9W";

// Etherscan API V2 — base unificada para todas as redes
const ETHERSCAN_V2_BASE = "https://api.etherscan.io/v2/api";

// Chain IDs
const CHAIN_ID_POLYGON = 137;
const CHAIN_ID_PLASMA = 9745; // 👉 substitua pelo Chain ID real da sua rede Plasma

// Contratos USDT
const USDT_CONTRACT_POLYGON = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const USDT_CONTRACT_PLASMA = "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb"; // 👉 confirme

// Explorers para links das transações
const EXPLORER_POLYGON = "https://polygonscan.com/tx";
const EXPLORER_PLASMA = "https://explorer.plasma.to/tx"; // 👉 substitua se diferente

export type WalletNetworkKey = "polygon" | "plasma";

export interface OnChainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  valueFormatted: string;
  symbol: string;
  decimals: number;
  timestamp: number;
  blockNumber: string;
  isIncoming: boolean;
  type: "usdt" | "native";
  explorerUrl: string;
}

export interface TransactionPage {
  transactions: OnChainTransaction[];
  hasMore: boolean;
  nextPage: number;
}

const PAGE_SIZE = 25;

function formatValue(raw: string, decimals: number): string {
  const num = Number(BigInt(raw)) / Math.pow(10, decimals);
  return num.toFixed(2);
}

function getChainConfig(network: WalletNetworkKey): {
  chainId: number;
  usdtContract: string;
  explorerBase: string;
  nativeSymbol: string;
} {
  if (network === "polygon") {
    return {
      chainId: CHAIN_ID_POLYGON,
      usdtContract: USDT_CONTRACT_POLYGON,
      explorerBase: EXPLORER_POLYGON,
      nativeSymbol: "POL",
    };
  }
  return {
    chainId: CHAIN_ID_PLASMA,
    usdtContract: USDT_CONTRACT_PLASMA,
    explorerBase: EXPLORER_PLASMA,
    nativeSymbol: "XPL",
  };
}

// Busca transações de token ERC20 (USDT)
async function fetchTokenTxs(
  address: string,
  network: WalletNetworkKey,
  page: number,
): Promise<OnChainTransaction[]> {
  const { chainId, usdtContract, explorerBase } = getChainConfig(network);

  if (chainId === 0) {
    console.warn(`Chain ID da rede ${network} não configurado.`);
    return [];
  }

  const response = await axios.get(ETHERSCAN_V2_BASE, {
    params: {
      chainid: chainId,
      module: "account",
      action: "tokentx",
      contractaddress: usdtContract,
      address,
      page,
      offset: PAGE_SIZE,
      sort: "desc",
      apikey: ETHERSCAN_API_KEY,
    },
    timeout: 10000,
  });

  if (response.data.status !== "1") return [];

  return (response.data.result as any[]).map((tx) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    valueFormatted: formatValue(tx.value, Number(tx.tokenDecimal)),
    symbol: "USDT",
    decimals: Number(tx.tokenDecimal),
    timestamp: Number(tx.timeStamp),
    blockNumber: tx.blockNumber,
    isIncoming: tx.to.toLowerCase() === address.toLowerCase(),
    type: "usdt",
    explorerUrl: `${explorerBase}/${tx.hash}`,
  }));
}

// Busca transações nativas (POL/XPL)
async function fetchNativeTxs(
  address: string,
  network: WalletNetworkKey,
  page: number,
): Promise<OnChainTransaction[]> {
  const { chainId, explorerBase, nativeSymbol } = getChainConfig(network);

  if (chainId === 0) {
    console.warn(`Chain ID da rede ${network} não configurado.`);
    return [];
  }

  const response = await axios.get(ETHERSCAN_V2_BASE, {
    params: {
      chainid: chainId,
      module: "account",
      action: "txlist",
      address,
      page,
      offset: PAGE_SIZE,
      sort: "desc",
      apikey: ETHERSCAN_API_KEY,
    },
    timeout: 10000,
  });

  if (response.data.status !== "1") return [];

  return (response.data.result as any[])
    .filter((tx) => tx.value !== "0")
    .map((tx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      valueFormatted: formatValue(tx.value, 18),
      symbol: nativeSymbol,
      decimals: 18,
      timestamp: Number(tx.timeStamp),
      blockNumber: tx.blockNumber,
      isIncoming: tx.to.toLowerCase() === address.toLowerCase(),
      type: "native",
      explorerUrl: `${explorerBase}/${tx.hash}`,
    }));
}

/**
 * Busca o histórico de transações (USDT + moeda nativa) de um endereço
 * na rede especificada, com paginação.
 *
 * Usa a Etherscan API V2 (api.etherscan.io/v2/api) com chainid,
 * compatível com Polygon (137) e qualquer rede futura via Chain ID.
 */
export async function fetchOnChainHistory(params: {
  address: string;
  network: WalletNetworkKey;
  page: number;
}): Promise<TransactionPage> {
  const { address, network, page } = params;

  const [usdtTxs, nativeTxs] = await Promise.all([
    fetchTokenTxs(address, network, page),
    fetchNativeTxs(address, network, page),
  ]);

  // Mescla e ordena por timestamp decrescente
  const all = [...usdtTxs, ...nativeTxs].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return {
    transactions: all,
    hasMore: usdtTxs.length === PAGE_SIZE || nativeTxs.length === PAGE_SIZE,
    nextPage: page + 1,
  };
}
