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
 * Assina a transação de transferência de USDT localmente (sem enviar
 * à blockchain) e envia a tx assinada para o backend via
 * POST saller/withdraw.
 *
 * O backend é responsável por:
 *   1. Submeter a tx assinada à blockchain usando sua carteira de gas
 *      (que tem POL/XPL) — o usuário não precisa ter gas nativo.
 *   2. Retornar o txid após a submissão.
 *
 * A chave privada do usuário nunca sai do device — apenas a transação
 * já assinada (que é um dado público após ser submetida) vai ao backend.
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
    // Consulta o contrato USDT para montar os dados da transação
    const usdtContract = new ethers.Contract(
      config.usdtContractAddress,
      ERC20_MIN_ABI,
      connectedWallet,
    );

    const decimals = await usdtContract.decimals();
    const amountInUnits = ethers.parseUnits(numericAmount.toString(), decimals);

    // Monta os dados do calldata (transfer(address,uint256)) sem enviar
    const data = usdtContract.interface.encodeFunctionData("transfer", [
      toAddress,
      amountInUnits,
    ]);

    // Busca o nonce atual da carteira do usuário
    const nonce = await provider.getTransactionCount(
      connectedWallet.address,
      "latest",
    );
    const feeData = await provider.getFeeData();
    const chainId = (await provider.getNetwork()).chainId;

    // Monta a transação sem gas (o backend vai definir o gas limit real
    // ao submeter — aqui usamos um valor conservador pra ERC20 transfer)
    const txRequest: ethers.TransactionRequest = {
      to: config.usdtContractAddress,
      data,
      nonce,
      chainId,
      gasLimit: 100_000n, // conservador para ERC20 transfer
      maxFeePerGas: feeData.maxFeePerGas ?? ethers.parseUnits("30", "gwei"),
      maxPriorityFeePerGas:
        feeData.maxPriorityFeePerGas ?? ethers.parseUnits("1", "gwei"),
      value: 0n,
      type: 2, // EIP-1559
    };

    // Assina a transação localmente — chave privada nunca sai do device
    const signedTx = await connectedWallet.signTransaction(txRequest);

    // Envia a tx assinada ao backend para ele submeter pagando o gas
    // 👉 Ajuste o endpoint quando ele existir no backend
    const response = await rstruther.post("saller/withdraw", {
      network,
      signedTx,
      fromAddress: connectedWallet.address,
      toAddress,
      amountUsdt: amount,
    });

    const { txid } = response.data ?? {};
    if (!txid) {
      throw new WithdrawError(
        "Resposta inesperada do servidor ao processar o saque.",
      );
    }

    return {
      txid,
      explorerUrl: config.explorerTxUrl(txid),
    };
  } catch (error: any) {
    if (error instanceof WithdrawError) throw error;

    const apiMessage = error?.response?.data?.message;
    if (apiMessage) throw new WithdrawError(apiMessage);

    throw new WithdrawError(
      "Não foi possível concluir o saque. Tente novamente.",
    );
  }
}

interface WithdrawPixQuoteParams {
  amountBrl: string;
  pixKey: string;
  pixKeyType: "cpf" | "cnpj" | "email" | "phone" | "random";
  network: WalletNetworkKey;
}

interface WithdrawPixQuote {
  withdrawId: string;
  address: string;
  amountUsdt: string;
  expiresInSeconds?: number;
}

/**
 * Passo 1: solicita cotação BRL→USDT e endereço de liquidação ao backend.
 * Não envia nada on-chain ainda.
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
 * Passo 3: confirma ao backend que o envio on-chain foi feito,
 * para processar a liquidação fiat (PIX).
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
 * Fluxo completo de saque PIX via relayer:
 *   1. Cota BRL→USDT e obtém endereço de liquidação (API).
 *   2. Assina a tx localmente e envia ao backend para submissão (sem gas do usuário).
 *   3. Confirma ao backend para processar o PIX.
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
