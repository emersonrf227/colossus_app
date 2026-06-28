import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";

// ⚠️ LEIA ANTES DE USAR ⚠️
//
// Este módulo NÃO oferece segurança equivalente a um Keychain/Keystore
// nativo (expo-secure-store, react-native-keychain). É uma alternativa
// usada porque o projeto está em build de desenvolvimento/EAS e instalar
// um módulo nativo exigiria gerar um novo build antes de poder testar.
//
// O que isso protege: leitura casual do AsyncStorage (ex: alguém abrindo
// o storage com Flipper, um dev debugando, um backup de storage exposto
// por engano) não vai ver a senha em texto puro.
//
// O que isso NÃO protege: um atacante com acesso ao binário do app pode
// descompilar o bundle JS e extrair a ENCRYPTION_KEY abaixo, porque ela
// vive no próprio código-fonte que vai dentro do app. Com a chave em
// mãos, a "criptografia" se torna reversível. Ou seja: isto é uma
// camada de ofuscação reforçada (AES de verdade, mas com chave exposta),
// não uma garantia criptográfica real.
//
// Recomendação: trocar para expo-secure-store (ou react-native-keychain)
// na próxima vez que um build nativo novo for gerado. Até lá, este
// módulo evita que a senha fique 100% em texto plano no disco.

const STORAGE_KEY_IDENTIFIER = "auth_last_identifier_enc";
const STORAGE_KEY_PASSWORD = "auth_last_password_enc";

// Chave fixa no código — ver aviso de segurança acima. Pode (e deve)
// ser trocada por algo específico do seu app, mas isso não resolve o
// problema de fundo (a chave continua dentro do bundle JS).
const ENCRYPTION_KEY = "colossus-crypto-app-v1-local-key";

interface StoredCredentials {
  identifier: string;
  password: string;
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
 * Salva a credencial usada no login mais recente (cifrada com AES-256),
 * para permitir re-login automático caso o refresh token também falhe.
 */
export async function saveLastCredentials(
  identifier: string,
  password: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_IDENTIFIER, encrypt(identifier));
    await AsyncStorage.setItem(STORAGE_KEY_PASSWORD, encrypt(password));
  } catch (error) {
    // Falha ao salvar não deve quebrar o fluxo de login normal — só
    // significa que o fallback de re-login não vai estar disponível.
    console.warn("Não foi possível salvar credenciais:", error);
  }
}

/**
 * Recupera a última credencial salva, se existir e a descriptografia
 * for bem-sucedida.
 */
export async function getLastCredentials(): Promise<StoredCredentials | null> {
  try {
    const [encryptedIdentifier, encryptedPassword] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY_IDENTIFIER),
      AsyncStorage.getItem(STORAGE_KEY_PASSWORD),
    ]);

    if (!encryptedIdentifier || !encryptedPassword) return null;

    const identifier = decrypt(encryptedIdentifier);
    const password = decrypt(encryptedPassword);

    if (!identifier || !password) return null;

    return { identifier, password };
  } catch (error) {
    console.warn("Não foi possível ler credenciais salvas:", error);
    return null;
  }
}

/**
 * Remove a credencial salva — deve ser chamado em qualquer logout
 * explícito do usuário (nunca deve sobreviver a um "Sair da conta").
 */
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
