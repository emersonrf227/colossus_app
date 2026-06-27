// Configuração de moedas suportadas pelo app.
// Hoje é uma constante local (APP_CURRENCY), mas a ideia é que no futuro
// isso venha de um settings/context/API — basta trocar de onde vem o valor,
// a estrutura abaixo (CURRENCIES) não muda.

export type CurrencyCode = "BRL" | "USD";

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string; // sigla exibida no display
  decimals: number; // quantas casas decimais essa moeda usa
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  BRL: { code: "BRL", label: "BRL", decimals: 2 },
  USD: { code: "USD", label: "USD", decimals: 2 },
};

// 👉 Configuração fixa do app por enquanto.
// Quando existir tela de settings, troque isso por algo como:
//   const { appCurrency } = useSettings();
// USD é o padrão quando o usuário ainda não configurou uma moeda.
export const DEFAULT_CURRENCY: CurrencyCode = "USD";
export const APP_CURRENCY: CurrencyCode = DEFAULT_CURRENCY;

/**
 * Resolve a config de moeda a partir de um valor possivelmente vindo de
 * settings/API/storage. Se for undefined, null, ou um código inválido,
 * cai no DEFAULT_CURRENCY (USD).
 *
 * Uso futuro, quando a moeda vier de settings:
 *   const userCurrencyCode = await getUserSetting("currency"); // pode vir undefined
 *   const currency = resolveCurrency(userCurrencyCode);
 */
export function resolveCurrency(code?: string | null): CurrencyConfig {
  if (code && code in CURRENCIES) {
    return CURRENCIES[code as CurrencyCode];
  }
  return CURRENCIES[DEFAULT_CURRENCY];
}

/**
 * Carrega a moeda salva pelo usuário em AsyncStorage (tela de
 * Idioma e Moeda). Cai no DEFAULT_CURRENCY se não houver nada salvo
 * ou se a leitura falhar.
 *
 * Uso:
 *   const currency = await loadSavedCurrency();
 */
export async function loadSavedCurrency(): Promise<CurrencyConfig> {
  try {
    // Import dinâmico evita acoplar este arquivo ao AsyncStorage em
    // contextos onde ele não esteja disponível (ex: testes).
    const AsyncStorage = (
      await import("@react-native-async-storage/async-storage")
    ).default;
    const saved = await AsyncStorage.getItem("appCurrency");
    return resolveCurrency(saved);
  } catch {
    return resolveCurrency();
  }
}

/**
 * Formata uma string de dígitos brutos (ex: vindos do teclado numérico)
 * de acordo com as regras da moeda informada.
 *
 * Exemplos com decimals = 2:
 *   "" -> "0.00"
 *   "5" -> "0.05"
 *   "1234" -> "12.34"
 *
 * Exemplos com decimals = 0 (Guarani):
 *   "" -> "0"
 *   "5" -> "5"
 *   "1234" -> "1234"
 */
export function formatAmount(
  rawValue: string,
  currency: CurrencyConfig,
): string {
  const numericValue = rawValue.replace(/[^0-9]/g, "");

  if (currency.decimals === 0) {
    const cleaned = numericValue.replace(/^0+(?=\d)/, "");
    return cleaned.length === 0 ? "0" : cleaned;
  }

  if (numericValue.length === 0) {
    return (0).toFixed(currency.decimals);
  }

  let formattedValue = numericValue;
  while (formattedValue.length < currency.decimals + 1) {
    formattedValue = "0" + formattedValue;
  }
  const integerPart = formattedValue.slice(0, -currency.decimals);
  const decimalPart = formattedValue.slice(-currency.decimals);
  const formattedIntegerPart = parseInt(integerPart, 10).toString();
  return `${formattedIntegerPart}.${decimalPart}`;
}

/** Valor "vazio" de exibição para uma dada moeda (estado inicial / após "C"). */
export function emptyAmount(currency: CurrencyConfig): string {
  return currency.decimals === 0 ? "0" : (0).toFixed(currency.decimals);
}

// --- Conversão para USDT --------------------------------------------------
//
// USDT é lastreado em USD, então:
// - Se a moeda escolhida for USD, o valor digitado já é o valor em USDT (1:1).
// - Se for BRL ou PYG, buscamos a cotação atual do USDT nessas moedas na
//   CoinGecko e convertemos: amountInUsdt = amountDigitado / cotação.
//
// Endpoint usado: simple/price?ids=tether&vs_currencies=brl,pyg
// (preço do USDT direto em BRL/PYG, sem passo intermediário)

const COINGECKO_SIMPLE_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=brl";

interface CoinGeckoTetherPriceResponse {
  tether: {
    brl?: number;
  };
}

export class QuoteFetchError extends Error {
  constructor(message = "Não foi possível obter a cotação. Tente novamente.") {
    super(message);
    this.name = "QuoteFetchError";
  }
}

/**
 * Busca a cotação atual do USDT em BRL e PYG na CoinGecko.
 * Lança QuoteFetchError em caso de falha de rede ou resposta inesperada.
 */
export async function fetchUsdtQuotes(): Promise<{ brl: number }> {
  let response: Response;
  try {
    response = await fetch(COINGECKO_SIMPLE_PRICE_URL);
  } catch {
    throw new QuoteFetchError();
  }

  if (!response.ok) {
    throw new QuoteFetchError();
  }

  let data: CoinGeckoTetherPriceResponse;
  try {
    data = await response.json();
  } catch {
    throw new QuoteFetchError();
  }

  const brl = data?.tether?.brl;
  // const pyg = data?.tether?.pyg;

  //   if (typeof brl !== "number" || typeof pyg !== "number") {
  //     throw new QuoteFetchError();
  //   }

  if (typeof brl !== "number") {
    throw new QuoteFetchError();
  }

  return { brl };
}

/**
 * Converte um valor digitado (string formatada, ex: "150.00" ou "1500")
 * na moeda informada para o equivalente em USDT.
 *
 * - USD -> passthrough (1:1), não precisa de cotação.
 * - BRL/PYG -> precisa da cotação (vinda de fetchUsdtQuotes).
 *
 * Retorna o valor em USDT como string com 2 casas decimais (padrão para
 * envio à API de invoice, que trabalha com USDT).
 */
export function convertToUsdt(
  amount: string,
  currency: CurrencyConfig,
  quotes?: { brl: number; pyg: number },
): string {
  const numericAmount = parseFloat(amount.replace(",", "."));

  if (currency.code === "USD") {
    return numericAmount.toFixed(2);
  }

  if (!quotes) {
    throw new QuoteFetchError("Cotação indisponível para converter o valor.");
  }

  const rate = currency.code === "BRL" ? quotes.brl : quotes.pyg;

  if (!rate || rate <= 0) {
    throw new QuoteFetchError();
  }

  const amountInUsdt = numericAmount / rate;
  return amountInUsdt.toFixed(2);
}
