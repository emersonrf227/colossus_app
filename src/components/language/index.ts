// Configuração de idiomas suportados pelo app.
// Hoje é uma constante local (APP_LANGUAGE), espelhando o mesmo padrão de
// currency.ts. Quando existir i18n de fato (ex: i18next), troque
// DEFAULT_LANGUAGE/resolveLanguage pela integração real, mas a estrutura
// abaixo (LANGUAGES) não precisa mudar.

export type LanguageCode = "pt" | "en" | "es" | "zh";

export interface LanguageConfig {
  code: LanguageCode;
  label: string; // nome exibido na própria língua (ex: "Português")
  flagEmoji: string;
}

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  pt: { code: "pt", label: "Português", flagEmoji: "🇧🇷" },
  en: { code: "en", label: "English", flagEmoji: "🇺🇸" },
  es: { code: "es", label: "Español", flagEmoji: "🇪🇸" },
  zh: { code: "zh", label: "中文", flagEmoji: "🇨🇳" },
};

// 👉 Configuração fixa do app por enquanto.
// Quando existir integração real de i18n, troque por algo como:
//   const { appLanguage } = useSettings();
export const DEFAULT_LANGUAGE: LanguageCode = "pt";
export const APP_LANGUAGE: LanguageCode = DEFAULT_LANGUAGE;

/**
 * Resolve a config de idioma a partir de um valor possivelmente vindo de
 * settings/API/storage. Se for undefined, null, ou um código inválido,
 * cai no DEFAULT_LANGUAGE (Português).
 */
export function resolveLanguage(code?: string | null): LanguageConfig {
  if (code && code in LANGUAGES) {
    return LANGUAGES[code as LanguageCode];
  }
  return LANGUAGES[DEFAULT_LANGUAGE];
}

/**
 * Carrega o idioma salvo pelo usuário em AsyncStorage (tela de
 * Idioma e Moeda). Cai no DEFAULT_LANGUAGE se não houver nada salvo
 * ou se a leitura falhar.
 *
 * Uso:
 *   const language = await loadSavedLanguage();
 */
export async function loadSavedLanguage(): Promise<LanguageConfig> {
  try {
    const AsyncStorage = (
      await import("@react-native-async-storage/async-storage")
    ).default;
    const saved = await AsyncStorage.getItem("appLanguage");
    return resolveLanguage(saved);
  } catch {
    return resolveLanguage();
  }
}
