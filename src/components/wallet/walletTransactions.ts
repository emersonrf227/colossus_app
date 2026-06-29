import { ethers } from "ethers";
import rstruther from "@/infraestructure/http/nodeApi";
import {
  getProvider,
  getNetworkConfig,
  ERC20_MIN_ABI,
  WalletNetworkKey,
} from "./walletProviders";
import { getSigningWallet } from "./walletStorage";

export class WithdrawError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WithdrawError";
  }
}

interface WithdrawCryptoParams {
  network: WalletNetworkKey;
  toAddress: string;
  amount: string; // valor em USDT, ex: "150.00"
}

interface WithdrawResult {
  txid: string;
  explorerUrl: string;
}

/**
 * Envia USDT da wallet do usuário para um endereço externo qualquer,
 * na rede especificada. A wallet assinante (com a chave privada) é
 * obtida, usada apenas dentro desta função, e não retorna para fora
 * deste módulo.
 */
export async function withdrawCrypto({
  network,
  toAddress,
  amount,
}: WithdrawCryptoParams): Promise<WithdrawResult> {
  if (!ethers.isAddress(toAddress)) {
    throw new WithdrawError("Endereço de destino inválido.");
  }

  const numericAmount = parseFloat(amount.replace(",", "."));
  if (!numericAmount || numericAmount <= 0) {
    throw new WithdrawError("Informe um valor válido para o saque.");
  }

  const signingWallet = await getSigningWallet();
  if (!signingWallet) {
    throw new WithdrawError(
      "Esta wallet não foi gerada pelo app — saques de wallets externas devem ser feitos diretamente no app da sua carteira (ex: SafePal).",
    );
  }

  const provider = getProvider(network);
  const config = getNetworkConfig(network);
  const connectedWallet = signingWallet.connect(provider);

  try {
    const usdtContract = new ethers.Contract(
      config.usdtContractAddress,
      ERC20_MIN_ABI,
      connectedWallet,
    );

    const decimals = await usdtContract.decimals();
    const amountInUnits = ethers.parseUnits(numericAmount.toString(), decimals);

    const tx = await usdtContract.transfer(toAddress, amountInUnits);
    const receipt = await tx.wait();

    if (!receipt || receipt.status !== 1) {
      throw new WithdrawError("A transação não foi confirmada na blockchain.");
    }

    return {
      txid: tx.hash,
      explorerUrl: config.explorerTxUrl(tx.hash),
    };
  } catch (error: any) {
    if (error instanceof WithdrawError) throw error;

    // Erros comuns do ethers/RPC traduzidos para mensagens úteis —
    // sem expor detalhes técnicos crus (que costumam vir em inglês e
    // cheios de jargão de blockchain) para o usuário final.
    if (
      error?.code === "INSUFFICIENT_FUNDS" ||
      /insufficient funds/i.test(error?.message ?? "")
    ) {
      throw new WithdrawError(
        `Saldo insuficiente de ${config.nativeCurrencySymbol} para pagar a taxa da rede.`,
      );
    }

    throw new WithdrawError(
      "Não foi possível concluir o saque. Tente novamente.",
    );
  }
}

interface WithdrawPixQuoteParams {
  amountBrl: string; // valor desejado em BRL, ex: "150.00"
  pixKey: string;
  pixKeyType: "cpf" | "cnpj" | "email" | "phone" | "random";
  network: WalletNetworkKey;
}

interface WithdrawPixQuote {
  withdrawId: string;
  /** Endereço de liquidação para onde o USDT deve ser enviado —
   *  vem da API, nunca é fixo no app, porque pode variar por
   *  liquidez/parceiro/momento. */
  address: string;
  /** Quanto USDT corresponde ao valor em BRL solicitado, já calculado
   *  pelo backend com a cotação do momento. */
  amountUsdt: string;
  /** Prazo (em segundos, a critério da API) em que essa cotação/
   *  endereço permanecem válidos antes de precisar cotar de novo. */
  expiresInSeconds?: number;
}

/**
 * Passo 1: solicita ao backend a cotação BRL→USDT e o endereço de
 * liquidação para onde o USDT deve ser enviado. NÃO envia nada
 * on-chain ainda — é só uma consulta/reserva.
 */
export async function requestPixWithdrawQuote(
  params: WithdrawPixQuoteParams,
): Promise<WithdrawPixQuote> {
  try {
    const response = await rstruther.post("saller/withdraw-pix", {
      amount: params.amountBrl,
      pixKey: params.pixKey,
      pixKeyType: params.pixKeyType,
      network: params.network,
    });

    const { withdrawId, address, amountUsdt, expiresInSeconds } =
      response.data ?? {};

    if (!address || !amountUsdt) {
      throw new WithdrawError("Resposta inesperada ao solicitar o saque PIX.");
    }

    return { withdrawId, address, amountUsdt, expiresInSeconds };
  } catch (error: any) {
    if (error instanceof WithdrawError) throw error;
    const message =
      error?.response?.data?.message ?? "Não foi possível cotar o saque PIX.";
    throw new WithdrawError(message);
  }
}

/**
 * Passo 3: avisa o backend que o envio on-chain foi feito, para que a
 * liquidação fiat (PIX) seja processada. Chamado DEPOIS que a
 * transação on-chain (passo 2, withdrawCrypto) já foi confirmada.
 *
 * 👉 Nome do endpoint é um placeholder — ajuste para a rota real de
 * confirmação quando ela existir.
 */
export async function confirmPixWithdraw(params: {
  withdrawId: string;
  txid: string;
}): Promise<void> {
  await rstruther.post("saller/withdraw-pix/confirm", {
    withdrawId: params.withdrawId,
    txid: params.txid,
  });
}

interface WithdrawPixParams {
  network: WalletNetworkKey;
  amountBrl: string;
  pixKey: string;
  pixKeyType: "cpf" | "cnpj" | "email" | "phone" | "random";
}

/**
 * Orquestra o fluxo completo de saque PIX:
 *   1. Cota o BRL→USDT e obtém o endereço de liquidação (API).
 *   2. Assina e envia o USDT on-chain para esse endereço.
 *   3. Confirma ao backend que o envio foi feito (API), para
 *      processar a liquidação fiat.
 *
 * Se o passo 3 falhar, o on-chain (passo 2) já aconteceu — por isso o
 * erro deixa claro que NÃO se deve tentar de novo (duplicaria o envio),
 * e orienta contatar o suporte com o txid e o withdrawId em mãos.
 */
export async function withdrawPix({
  network,
  amountBrl,
  pixKey,
  pixKeyType,
}: WithdrawPixParams): Promise<WithdrawResult & { withdrawId: string }> {
  const quote = await requestPixWithdrawQuote({
    amountBrl,
    pixKey,
    pixKeyType,
    network,
  });

  const { txid, explorerUrl } = await withdrawCrypto({
    network,
    toAddress: quote.address,
    amount: quote.amountUsdt,
  });

  try {
    await confirmPixWithdraw({ withdrawId: quote.withdrawId, txid });
  } catch {
    throw new WithdrawError(
      `O envio foi confirmado na blockchain (TXID: ${txid}), mas não foi possível confirmar automaticamente o PIX. Entre em contato com o suporte informando este TXID e o código de saque ${quote.withdrawId}.`,
    );
  }

  return { txid, explorerUrl, withdrawId: quote.withdrawId };
}
