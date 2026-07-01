import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

// Mesmas limitações de segurança do secureCredentials.ts — AES local
// protege contra leitura casual, mas a chave está no bundle JS.
// Migrar para expo-secure-store quando houver build nativo disponível.

const STORAGE_KEY_PIN = "wallet_pin_enc";
const ENCRYPTION_KEY = "colossus-crypto-app-v1-pin-key";

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

/** Persiste o PIN de 6 dígitos, criptografado. */
export async function saveWalletPin(pin: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_PIN, encrypt(pin));
}

/** Verifica se o PIN informado confere com o salvo. */
export async function verifyWalletPin(pin: string): Promise<boolean> {
  const encrypted = await AsyncStorage.getItem(STORAGE_KEY_PIN);
  if (!encrypted) return false;
  const stored = decrypt(encrypted);
  return stored === pin;
}

/** Retorna true se já existe um PIN configurado neste device. */
export async function hasWalletPin(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY_PIN);
  return !!stored;
}

/** Remove o PIN salvo — usado ao redefinir. */
export async function clearWalletPin(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_PIN);
}
