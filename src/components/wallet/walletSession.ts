/**
 * Estado de sessão da wallet (em memória, zera ao fechar o app).
 *
 * Controla se o usuário já digitou o PIN nesta sessão:
 * - O PIN é pedido na primeira entrada na WalletHome (vindo da tela inicial).
 * - Navegar para outras telas e voltar NÃO pede PIN de novo.
 * - Voltar para a tela de login (SingIn) reseta a sessão — a próxima
 *   entrada na wallet pede PIN novamente.
 */
let walletUnlockedThisSession = false;

export function isWalletSessionUnlocked(): boolean {
  return walletUnlockedThisSession;
}

export function setWalletSessionUnlocked(value: boolean): void {
  walletUnlockedThisSession = value;
}
