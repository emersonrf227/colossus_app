import AsyncStorage from "@react-native-async-storage/async-storage";
import { aesEncrypt, aesDecrypt } from "./cryptoUtils";

const STORAGE_KEY_PIN = "wallet_pin_enc";
const ENCRYPTION_KEY = "colossus-crypto-app-v1-pin-key";

export async function saveWalletPin(pin: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_PIN, aesEncrypt(pin, ENCRYPTION_KEY));
}

export async function verifyWalletPin(pin: string): Promise<boolean> {
  const encrypted = await AsyncStorage.getItem(STORAGE_KEY_PIN);
  if (!encrypted) return false;
  const stored = aesDecrypt(encrypted, ENCRYPTION_KEY);
  return stored === pin;
}

export async function hasWalletPin(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY_PIN);
  return !!stored;
}

export async function clearWalletPin(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_PIN);
}
