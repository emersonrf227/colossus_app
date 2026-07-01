import AsyncStorage from "@react-native-async-storage/async-storage";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { aesEncrypt, aesDecrypt } from "./cryptoUtils";

const STORAGE_KEY_ENCRYPTED_MNEMONIC = "wallet_mnemonic_enc";
const STORAGE_KEY_WALLET_ADDRESS = "wallet_address";
const STORAGE_KEY_WALLET_SOURCE = "wallet_source";

const ENCRYPTION_KEY = "colossus-crypto-app-v1-wallet-key";

export type WalletSource = "app" | "external";

interface GeneratedWallet {
  address: string;
  mnemonic: string;
}

function encrypt(value: string): string {
  return aesEncrypt(value, ENCRYPTION_KEY);
}

function decrypt(cipherText: string): string | null {
  return aesDecrypt(cipherText, ENCRYPTION_KEY);
}

/**
 * Gera uma nova wallet (endereço + mnemônico de 12 palavras com checksum BIP-39 válido).
 */
export function generateWallet(): GeneratedWallet {
  const langEn = ethers.wordlists.en;

  // Gera 11 palavras aleatórias (os primeiros 121 bits do mnemônico)
  const seed =
    Date.now().toString() + Math.random().toString() + Math.random().toString();
  let hash = CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);

  const wordIndexes: number[] = [];
  for (let i = 0; i < 11; i++) {
    if (i > 0 && i % 4 === 0) {
      hash = CryptoJS.SHA256(
        CryptoJS.enc.Hex.parse(hash + i.toString()),
      ).toString(CryptoJS.enc.Hex);
    }
    const chunk = hash.slice(i * 3, i * 3 + 3);
    const index = parseInt(chunk, 16) & 0x7ff; // 11 bits = 0-2047
    wordIndexes.push(index);
  }

  // Converte os 11 índices em 121 bits
  let bits = "";
  for (const idx of wordIndexes) {
    bits += idx.toString(2).padStart(11, "0");
  }
  // bits tem 121 bits — precisamos de 128 bits de entropia total
  // Os 7 bits que faltam vêm do início dos 4 bits de checksum (na última palavra)
  // Preenche com 7 bits extras do hash
  const extraByte = parseInt(hash.slice(33, 35), 16);
  const extraBits = (extraByte & 0xfe).toString(2).padStart(8, "0").slice(0, 7);
  bits += extraBits; // agora temos 128 bits de entropia

  // Calcula SHA256 dos 128 bits (16 bytes) para obter checksum
  const entropyHex = BigInt("0b" + bits)
    .toString(16)
    .padStart(32, "0");
  const checksumHash = CryptoJS.SHA256(
    CryptoJS.enc.Hex.parse(entropyHex),
  ).toString(CryptoJS.enc.Hex);

  // Checksum = primeiros 4 bits do hash
  const checksumBits = parseInt(checksumHash[0], 16)
    .toString(2)
    .padStart(4, "0");

  // Última palavra = 7 bits extras de entropia + 4 bits de checksum = 11 bits
  const lastWordBits = extraBits + checksumBits;
  const lastWordIndex = parseInt(lastWordBits, 2) & 0x7ff;
  wordIndexes.push(lastWordIndex);

  const mnemonic = wordIndexes.map((idx) => langEn.getWord(idx)).join(" ");
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  return { address: wallet.address, mnemonic };
}

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

export async function persistExternalWallet(address: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, address);
  await AsyncStorage.setItem(STORAGE_KEY_WALLET_SOURCE, "external");
  await AsyncStorage.removeItem(STORAGE_KEY_ENCRYPTED_MNEMONIC);
}

export async function getWalletSource(): Promise<WalletSource | null> {
  const source = await AsyncStorage.getItem(STORAGE_KEY_WALLET_SOURCE);
  return source === "app" || source === "external" ? source : null;
}

export async function getStoredWalletAddress(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY_WALLET_ADDRESS);
}

export async function getStoredMnemonic(): Promise<string | null> {
  const encrypted = await AsyncStorage.getItem(STORAGE_KEY_ENCRYPTED_MNEMONIC);
  if (!encrypted) return null;
  return decrypt(encrypted);
}

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

export async function localSeedMatchesAddress(
  apiAddress: string,
): Promise<boolean> {
  const mnemonic = await getStoredMnemonic();
  if (!mnemonic) return false;
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return wallet.address.toLowerCase() === apiAddress.toLowerCase();
  } catch {
    return false;
  }
}

export async function clearStoredWallet(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEY_ENCRYPTED_MNEMONIC,
    STORAGE_KEY_WALLET_ADDRESS,
    STORAGE_KEY_WALLET_SOURCE,
  ]);
}
