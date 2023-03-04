import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import fi from "./fi";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: { translation: en },
  fi: { translation: fi }
};

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already protects from xss
    },
    detection: {
      lookupLocalStorage: "testaustime-language"
    }
  })
  .catch(console.error);

export default i18n;

export type Locales = keyof typeof resources;
