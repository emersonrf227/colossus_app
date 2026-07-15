import { ethers } from "ethers";
import helmApi from "@/infraestructure/http/nodeApi";
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
  memo?: string; // opcional — concatenado no data da tx, visível no explorer
}

interface WithdrawResult {
  txid: string;
  explorerUrl: string;
}

/**
 * Converte string UTF-8 → hex sem usar Buffer (não existe no React Native).
 */
function utf8ToHex(str: string): string {
  const bytes = Array.from(str).flatMap((char) => {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x80) return [code];
    if (code < 0x800) return [0xc0 | (code >> 6), 0x80 | (code & 0x3f)];
    if (code < 0x10000)
      return [
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      ];
    return [
      0xf0 | (code >> 18),
      0x80 | ((code >> 12) & 0x3f),
      0x80 | ((code >> 6) & 0x3f),
      0x80 | (code & 0x3f),
    ];
  });
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Envia USDT da wallet do usuário para um endereço externo.
 * Se memo for informado, é concatenado como sufixo hex no data da tx —
 * mesma técnica usada no backend. Visível no "Input Data" do Polygonscan.
 */
export async function withdrawCrypto({
  network,
  toAddress,
  amount,
  memo,
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
    // Obtém os decimais do contrato USDT
    const usdtContract = new ethers.Contract(
      config.usdtContractAddress,
      ERC20_MIN_ABI,
      connectedWallet,
    );
    const decimals = await usdtContract.decimals();
    const amountInUnits = ethers.parseUnits(numericAmount.toString(), decimals);

    // Monta o data: encodeFunctionData("transfer") + memo em hex como sufixo
    // Mesma técnica do backend — o contrato ignora bytes extras após os params,
    // mas eles ficam gravados on-chain e visíveis no explorer.
    const iface = new ethers.Interface(ERC20_MIN_ABI);
    let data = iface.encodeFunctionData("transfer", [toAddress, amountInUnits]);

    if (memo && memo.trim().length > 0) {
      data = data + utf8ToHex(`MEMO: ${memo.trim()}`);
    }

    // Envia a tx diretamente com o data montado
    const tx = await connectedWallet.sendTransaction({
      to: config.usdtContractAddress,
      value: BigInt(0),
      data,
      gasLimit: 200000,
    });

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

export async function requestPixWithdrawQuote(
  params: WithdrawPixQuoteParams,
): Promise<WithdrawPixQuote> {
  try {
    const response = await helmApi.post("saller/withdraw-pix", {
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

export async function confirmPixWithdraw(params: {
  withdrawId: string;
  txid: string;
}): Promise<void> {
  await helmApi.post("saller/withdraw-pix/confirm", {
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
