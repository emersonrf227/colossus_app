import CryptoJS from "crypto-js";

/**
 * Gera um IV de 16 bytes via SHA256(timestamp + Math.random),
 * sem depender de crypto.getRandomValues (que exige módulo nativo no RN).
 */
function generateIV(): CryptoJS.lib.WordArray {
  const seed = Date.now().toString() + Math.random().toString();
  const hash = CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);
  return CryptoJS.enc.Hex.parse(hash.slice(0, 32)); // 16 bytes
}

/**
 * Criptografa um valor string usando AES-CBC com IV gerado manualmente.
 * O IV é serializado junto com o ciphertext (ivHex:ciphertext) para
 * ser recuperado no decrypt.
 */
export function aesEncrypt(value: string, encryptionKey: string): string {
  const key = CryptoJS.enc.Utf8.parse(
    encryptionKey.padEnd(32, "0").slice(0, 32),
  );
  const iv = generateIV();
  const encrypted = CryptoJS.AES.encrypt(value, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.toString();
}

/**
 * Descriptografa um valor criptografado por aesEncrypt.
 * Retorna null se o formato for inválido ou a descriptografia falhar.
 */
export function aesDecrypt(
  cipherText: string,
  encryptionKey: string,
): string | null {
  try {
    const [ivHex, encrypted] = cipherText.split(":");
    if (!ivHex || !encrypted) return null;
    const key = CryptoJS.enc.Utf8.parse(
      encryptionKey.padEnd(32, "0").slice(0, 32),
    );
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const bytes = CryptoJS.AES.decrypt(encrypted, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded.length > 0 ? decoded : null;
  } catch {
    return null;
  }
}
