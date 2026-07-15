import helmApi from "@/infraestructure/http/nodeApi";
import axios from "axios";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface SwapQuote {
  amount_brl: string;
  price_usd: string; // cotação: 1 USDT = X BRL
  total_brl: string;
  fee_brl: string;
  send_usd: string;
  timeout: number; // segundos até expirar
  amount_usd: string;
  value_txusdt: string;
  send_txusdt: string;
}

export interface NetworkTicker {
  polygon: number;
  plasma: number;
}

export type PixKeyType =
  | "CPF"
  | "CNPJ"
  | "PHONE"
  | "EMAIL"
  | "EVP"
  | "COPYPASTE";
export type WalletNetwork = "POLYGON" | "PLASMA";

export interface DecodedBrCode {
  type: string;
  merchantName: string;
  merchantCity: string;
  pixKey: string;
  transactionAmount: number;
  txid: string;
}

export interface PixTransaction {
  id: number;
  uuid: string;
  txid: string | null;
  swapixId: string;
  origemAddress: string; // endereço para enviar o USDT
  destinarionAddress: string;
  typeDestinationKey: PixKeyType;
  amount: string; // valor em BRL
  fee_brl: string;
  amount_usd: string; // quanto USDT enviar
  total_brl: string;
  send_brl: string;
  life: number; // segundos de vida da transação
  status: "OPEN" | "SUCCESS" | "FAILED" | "EXPIRED" | "ERROR" | string;
  displayDestination: string | null;
  cryptoNetwork: WalletNetwork;
  endtoend: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 1. Cotação SmartPay
// ---------------------------------------------------------------------------

/**
 * Busca a cotação atual USDT→BRL.
 * Usa axios direto (não o helmApi autenticado) pois é uma API pública.
 */
export async function fetchSwapQuote(amountBrl: number): Promise<SwapQuote> {
  const response = await axios.get(
    "https://connect.smartpay.com.vc/api/swapix/swapquote",
    {
      params: { currency: "brl", amount: amountBrl, type: "sell" },
      timeout: 10000,
    },
  );

  if (response.data?.status !== "ok") {
    throw new Error("Não foi possível obter a cotação atual.");
  }

  return response.data.data as SwapQuote;
}

// ---------------------------------------------------------------------------
// 2. Ticker de markup por rede
// ---------------------------------------------------------------------------

/**
 * Busca o percentual de markup adicional por rede (ex: 2.5%).
 * Usado para calcular o valor real de USDT que o usuário precisa enviar.
 */
export async function fetchNetworkTicker(): Promise<NetworkTicker> {
  const response = await helmApi.get("sell/ticker");
  const res = response.data?.data?.res;

  if (!res) throw new Error("Não foi possível obter o ticker de rede.");

  return {
    polygon: Number(res.polygon ?? 2.5),
    plasma: Number(res.plasma ?? 2.5),
  };
}

// ---------------------------------------------------------------------------
// 3. Cálculo de USDT necessário
// ---------------------------------------------------------------------------

/**
 * Calcula quanto USDT o usuário precisa enviar para receber o valor
 * em BRL solicitado, já considerando o markup da rede e a cotação atual.
 *
 * Fórmula:
 *   markup  = 1 - (tickerPercent / 100)          ex: 1 - 2.5/100 = 0.975
 *   bruto   = amountBrl / markup                  ex: 50 / 0.975 = 51.28
 *   usdt    = bruto / price_usd                   ex: 51.28 / 5.237 = 9.80
 */
export function calculateUsdtNeeded(params: {
  amountBrl: number;
  priceUsd: number; // price_usd da cotação
  tickerPercent: number;
}): number {
  const { amountBrl, priceUsd, tickerPercent } = params;
  const markup = 1 - tickerPercent / 100;
  const bruto = amountBrl / markup;
  const usdt = bruto / priceUsd;
  return Math.ceil(usdt * 100) / 100; // arredonda pra cima em 2 casas
}

// ---------------------------------------------------------------------------
// 4. Decode QR PIX (Br Code)
// ---------------------------------------------------------------------------

export async function decodeBrCode(emv: string): Promise<DecodedBrCode> {
  const response = await helmApi.post("sell/decode-brcode", { emv });

  if (response.data?.statusCode !== 200) {
    throw new Error("QR Code inválido ou não reconhecido.");
  }

  return response.data.data as DecodedBrCode;
}

// ---------------------------------------------------------------------------
// 5. Criar transação PIX off-ramp
// ---------------------------------------------------------------------------

export interface CreatePixParams {
  network: WalletNetwork;
  key: string; // chave PIX
  typeKey: PixKeyType;
  walletRet: string; // endereço da wallet do usuário
  email: string;
  amount: number; // valor em BRL
  proofKey: string; // 12 iniciais + 8 finais da chave privada
}

export async function createPixTransaction(
  params: CreatePixParams,
): Promise<PixTransaction> {
  console.log({
    network: params.network,
    key: params.key,
    typeKey: params.typeKey,
    walletRet: params.walletRet,
    email: params.email,
    amount: params.amount,
    proofKey: params.proofKey,
  });
  const response = await helmApi.post("sell/create-crypto-to-pix", {
    network: params.network,
    key: params.key,
    typeKey: params.typeKey,
    walletRet: params.walletRet,
    email: params.email,
    amount: params.amount,
    proofKey: params.proofKey,
  });
  console.log("res ===>", response);
  const res = response.data?.data?.res;

  if (!res || response.data?.data?.status !== "SUCCESS") {
    const msg =
      response.data?.data?.msg ?? "Não foi possível criar a transação PIX.";
    throw new Error(msg);
  }

  return res as PixTransaction;
}

// ---------------------------------------------------------------------------
// 6. Polling de status
// ---------------------------------------------------------------------------

export async function getPixTransactionStatus(
  uuid: string,
): Promise<PixTransaction> {
  const response = await helmApi.get("sell/get-status-crypto-to-pix", {
    params: { uuid },
  });

  const res = response.data?.res;
  if (!res)
    throw new Error("Não foi possível consultar o status da transação.");

  return res as PixTransaction;
}

// ---------------------------------------------------------------------------
// 7. Enviar TXID após confirmar envio on-chain
// ---------------------------------------------------------------------------

/**
 * Chamado após withdrawCrypto — registra o txid da transação on-chain
 * na transação PIX correspondente.
 *
 * POST sell/send-txid
 */
export async function sendPixTxid(params: {
  proofKey: string;
  txid: string;
  id: number;
}): Promise<void> {
  await helmApi.post("sell/send-txid", {
    proofKey: params.proofKey,
    txid: params.txid,
    id: params.id,
  });
}

// ---------------------------------------------------------------------------
// 8. Consultar comprovante PIX pelo proofKey + txid
// ---------------------------------------------------------------------------

export interface PixProofResult {
  success: boolean;
  data: PixTransaction | null;
}

/**
 * Verifica se uma transação on-chain sainte (USDT out) corresponde a
 * um PIX off-ramp processado.
 *
 * POST sell/proof
 * Usado na tela de histórico para enriquecer transações de saída com
 * dados do PIX (beneficiário, valor BRL, end-to-end etc.).
 */
export async function getPixProof(params: {
  proofKey: string;
  txid: string;
}): Promise<PixTransaction | null> {
  try {
    const response = await helmApi.post("sell/proof", {
      proofKey: params.proofKey,
      txid: params.txid,
    });

    const res = response.data?.data?.res;
    if (!res || response.data?.data?.status !== "SUCCESS") return null;

    return res as PixTransaction;
  } catch {
    return null;
  }
}
