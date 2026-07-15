/**
 * Configuração de whitelabel.
 *
 * Todos os textos e identificadores de marca do app leem deste arquivo.
 * Para gerar uma nova versão whitelabel, altere apenas os valores abaixo.
 *
 * Nas traduções (src/i18n/*.ts) o nome da marca aparece como {{appName}}
 * e é interpolado automaticamente pelo i18next (ver src/i18n/index.ts).
 */
export const BRAND = {
  /** Nome da marca exibido em todo o app */
  name: "Helm",

  /** Nome em caixa alta (recibos, tela "sobre", splash) */
  get nameUpper() {
    return this.name.toUpperCase();
  },

  /** E-mail de suporte impresso em recibos e comprovantes */
  supportEmail: "support@colossuscrypto.com.br",

  /** Usuário do Telegram aberto nas telas de login/suporte */
  telegram: "colossus_crypto",
};

export default BRAND;
