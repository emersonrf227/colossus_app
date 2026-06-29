import AsyncStorage from "@react-native-async-storage/async-storage";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";

// ⚠️ LEIA ANTES DE USAR ⚠️
//
// Este módulo gera e guarda localmente a seed phrase (mnemônico) de uma
// wallet criada pelo próprio app para o usuário. Isso é equivalente a
// guardar as chaves do dinheiro do usuário — se vazar, o saldo pode ser
// movido por terceiros sem qualquer possibilidade de reversão
// (diferente de senha de login, que pode ser trocada).
//
// A criptografia usada aqui (AES via crypto-js, com chave fixa no
// código) tem a MESMA limitação já documentada em secureCredentials.ts:
// protege contra leitura casual do AsyncStorage, mas NÃO protege contra
// alguém que descompile o bundle JS do app e extraia a chave — quem
// tiver a chave, descriptografa a seed.
//
// Assim que houver um build nativo disponível, a prioridade #1 deve ser
// migrar isto para expo-secure-store ou react-native-keychain, que
// usam Keychain (iOS) / Keystore (Android) — armazenamento criptografado
// pelo hardware/SO, não pela aplicação.

const STORAGE_KEY_ENCRYPTED_MNEMONIC = "wallet_mnemonic_enc";
const STORAGE_KEY_WALLET_ADDRESS = "wallet_address";
const STORAGE_KEY_WALLET_SOURCE = "wallet_source"; // "app" | "external"

// Mesma observação de secureCredentials.ts: troque por algo específico
// do seu app, mas isso não resolve o problema de fundo (a chave
// continua dentro do bundle JS).
const ENCRYPTION_KEY = "colossus-crypto-app-v1-wallet-key";

export type WalletSource = "app" | "external";

interface GeneratedWallet {
  address: string;
  mnemonic: string;
}

function encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
}

function decrypt(cipherText: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded.length > 0 ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Gera uma nova wallet (endereço + mnemônico de 12 palavras) usando
 * ethers.js. Não salva nada ainda — isso é feito separadamente, depois
 * que o usuário confirmar o backup da seed (ver confirmWalletBackup).
 */
export function generateWallet(): GeneratedWallet {
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic?.phrase;

  if (!mnemonic) {
    // Não deveria acontecer com createRandom(), mas se a lib mudar de
    // comportamento no futuro, falhar alto é melhor que salvar undefined.
    throw new Error("Não foi possível gerar a frase de recuperação.");
  }

  return { address: wallet.address, mnemonic };
}

/**
 * Sorteia N índices distintos (0-based) dentre as 12 palavras, para a
 * etapa de confirmação de backup ("digite as palavras 3, 7 e 11").
 */
export function pickRandomWordIndexes(
  totalWords: number,
  count: number,
): number[] {
  const indexes = Array.from({ length: totalWords }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, count).sort((a, b) => a - b);
}

/**
 * Persiste a wallet gerada (criptografada) — só deve ser chamado DEPOIS
 * que o usuário confirmou corretamente as palavras de verificação do
 * backup, nunca antes.
 */
export async function persistGeneratedWallet(
  wallet: GeneratedWallet,
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY_ENCRYPTED_MNEMONIC,
    encrypt(wallet.mnemonic),
  );
  await AsyncStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, wallet.address);
  await AsyncStorage.setItem(STORAGE_KEY_WALLET_SOURCE, "app");
}

/**
 * Marca que o usuário está usando uma wallet externa (ex: SafePal),
 * sem nenhum mnemônico envolvido — apenas o endereço público.
 */
export async function persistExternalWallet(address: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, address);
  await AsyncStorage.setItem(STORAGE_KEY_WALLET_SOURCE, "external");
  // Garante que não sobra mnemônico de uma geração anterior, caso o
  // usuário troque de "wallet do app" para "wallet externa" depois.
  await AsyncStorage.removeItem(STORAGE_KEY_ENCRYPTED_MNEMONIC);
}

/**
 * De onde vem a wallet configurada atualmente: gerada pelo app, ou
 * endereço externo informado pelo usuário. Retorna null se nenhuma
 * wallet foi configurada ainda.
 */
export async function getWalletSource(): Promise<WalletSource | null> {
  const source = await AsyncStorage.getItem(STORAGE_KEY_WALLET_SOURCE);
  return source === "app" || source === "external" ? source : null;
}

export async function getStoredWalletAddress(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY_WALLET_ADDRESS);
}

/**
 * Recupera o mnemônico salvo, para a tela de "exportar carteira".
 * Retorna null se não houver wallet gerada pelo app (ex: usuário usa
 * wallet externa, que não tem mnemônico armazenado por aqui).
 */
export async function getStoredMnemonic(): Promise<string | null> {
  const encrypted = await AsyncStorage.getItem(STORAGE_KEY_ENCRYPTED_MNEMONIC);
  if (!encrypted) return null;
  return decrypt(encrypted);
}

/**
 * Reconstrói a wallet "assinante" (com chave privada em memória, nunca
 * persistida em texto puro) a partir do mnemônico salvo. Usada apenas
 * no momento de assinar uma transação de saque — o objeto retornado
 * deve viver o mínimo de tempo possível em memória, nunca ser logado,
 * e nunca ser passado para fora deste módulo além do necessário para
 * assinar e enviar a transação.
 *
 * Retorna null se não houver wallet gerada pelo app (ex: usuário usa
 * wallet externa, que não tem chave privada para assinar nada por
 * aqui — sacar de uma wallet externa é responsabilidade do próprio
 * usuário, fora do app).
 */
export async function getSigningWallet(): Promise<ethers.Wallet | null> {
  const mnemonic = await getStoredMnemonic();
  if (!mnemonic) return null;

  try {
    const hdWallet = ethers.Wallet.fromPhrase(mnemonic);
    return hdWallet;
  } catch {
    return null;
  }
}

/**
 * Remove toda e qualquer informação de wallet salva localmente —
 * usado, por exemplo, se o usuário trocar de wallet ou fizer logout
 * completo do app (a critério do fluxo de signOut).
 */
export async function clearStoredWallet(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEY_ENCRYPTED_MNEMONIC,
    STORAGE_KEY_WALLET_ADDRESS,
    STORAGE_KEY_WALLET_SOURCE,
  ]);
}
