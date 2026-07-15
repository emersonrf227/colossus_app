import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BRAND from "@/config/brand";

import pt from "./pt";
import en from "./en";
import es from "./es";
import zh from "./zh";
import ar from "./ar";
import ru from "./ru";

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  ar: { translation: ar },
  ru: { translation: ru },
};

// Carrega o idioma salvo pelo usuário em AsyncStorage antes de inicializar.
// A chave "appLanguage" é a mesma usada em src/config/language.ts.
AsyncStorage.getItem("appLanguage").then((savedLang) => {
  const lng = savedLang && savedLang in resources ? savedLang : "pt";

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng,
    fallbackLng: "pt",
    resources,
    interpolation: {
      escapeValue: false,
      // Toda tradução pode usar {{appName}} — valor vem do config de whitelabel
      defaultVariables: { appName: BRAND.name, devName: BRAND.devUpper },
    },
  });
});

export default i18n;
