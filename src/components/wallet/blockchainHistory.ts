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
const EXPLORER_PLASMA = "https://plasmascan.to/tx"; // explorer oficial da Plasma

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

/**
 * GET no Etherscan com retry para rate limit.
 * A API key é compartilhada entre todos os usuários do app (free tier =
 * 5 req/s) — quando o limite estoura, o Etherscan responde status "0" com
 * "Max rate limit reached". Antes isso virava lista vazia silenciosa;
 * agora espera um pouco e tenta de novo (até 2 retries).
 */
async function etherscanGet(params: Record<string, unknown>): Promise<any> {
  let lastData: any = null;
  console.log("PARAMS====>", params);

  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await axios.get(ETHERSCAN_V2_BASE, {
      params,
      timeout: 6000,
    });
    lastData = response.data;
    const isRateLimited =
      lastData?.status !== "1" &&
      typeof lastData?.result === "string" &&
      lastData.result.toLowerCase().includes("rate limit");
    if (!isRateLimited) return lastData;
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }
  return lastData;
}

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

  const data = await etherscanGet({
    chainid: chainId,
    module: "account",
    action: "tokentx",
    contractaddress: usdtContract,
    address,
    page,
    offset: PAGE_SIZE,
    sort: "desc",
    apikey: ETHERSCAN_API_KEY,
  });

  if (data.status !== "1") return [];

  return (data.result as any[]).map((tx) => ({
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

  const data = await etherscanGet({
    chainid: chainId,
    module: "account",
    action: "txlist",
    address,
    page,
    offset: PAGE_SIZE,
    sort: "desc",
    apikey: ETHERSCAN_API_KEY,
  });

  if (data.status !== "1") return [];

  return (data.result as any[])
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

  // allSettled: se uma das consultas falhar/estourar timeout (ex: rede sem
  // suporte no explorer), a outra ainda é exibida em vez de erro geral.
  const [usdtResult, nativeResult] = await Promise.allSettled([
    fetchTokenTxs(address, network, page),
    fetchNativeTxs(address, network, page),
  ]);
  const usdtTxs = usdtResult.status === "fulfilled" ? usdtResult.value : [];
  const nativeTxs =
    nativeResult.status === "fulfilled" ? nativeResult.value : [];
  if (usdtResult.status === "rejected" && nativeResult.status === "rejected") {
    throw new Error("history_fetch_failed");
  }

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
