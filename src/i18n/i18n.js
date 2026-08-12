import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fa from "./locales/fa.json";
import ps from "./locales/ps.json";
import en from "./locales/en.json";

// Get saved language, otherwise use English
const savedLanguage =
  localStorage.getItem("at-language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },

    fa: {
      translation: fa,
    },

    ps: {
      translation: ps,
    },
  },

  // Start with the saved language
  lng: savedLanguage,

  // English is the fallback
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
