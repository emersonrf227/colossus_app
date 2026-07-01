import AsyncStorage from "@react-native-async-storage/async-storage";
import { aesEncrypt, aesDecrypt } from "./cryptoUtils";

// ⚠️ AES com IV gerado via SHA256 (sem crypto nativo).
// Mesmas limitações documentadas anteriormente — protege contra leitura
// casual, não contra descompilação do bundle JS.

const STORAGE_KEY_IDENTIFIER = "auth_last_identifier_enc";
const STORAGE_KEY_PASSWORD = "auth_last_password_enc";
const ENCRYPTION_KEY = "colossus-crypto-app-v1-local-key";

interface StoredCredentials {
  identifier: string;
  password: string;
}

export async function saveLastCredentials(
  identifier: string,
  password: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY_IDENTIFIER,
      aesEncrypt(identifier, ENCRYPTION_KEY),
    );
    await AsyncStorage.setItem(
      STORAGE_KEY_PASSWORD,
      aesEncrypt(password, ENCRYPTION_KEY),
    );
  } catch (error) {
    console.warn("Não foi possível salvar credenciais:", error);
  }
}

export async function getLastCredentials(): Promise<StoredCredentials | null> {
  try {
    const [encId, encPwd] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY_IDENTIFIER),
      AsyncStorage.getItem(STORAGE_KEY_PASSWORD),
    ]);
    if (!encId || !encPwd) return null;
    const identifier = aesDecrypt(encId, ENCRYPTION_KEY);
    const password = aesDecrypt(encPwd, ENCRYPTION_KEY);
    if (!identifier || !password) return null;
    return { identifier, password };
  } catch (error) {
    console.warn("Não foi possível ler credenciais salvas:", error);
    return null;
  }
}

export async function clearLastCredentials(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEY_IDENTIFIER,
      STORAGE_KEY_PASSWORD,
    ]);
  } catch (error) {
    console.warn("Não foi possível limpar credenciais salvas:", error);
  }
}
