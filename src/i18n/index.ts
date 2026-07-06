import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "./pt";
import en from "./en";
import es from "./es";
import zh from "./zh";
import ar from "./ar";
import ru from "./ru";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",

  lng: "pt",

  fallbackLng: "pt",

  resources: {
    pt: {
      translation: pt,
    },
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
    zh: {
      translation: zh,
    },
    ar: {
      translation: ar,
    },
    ru: {
      translation: ru,
    },
  },

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
