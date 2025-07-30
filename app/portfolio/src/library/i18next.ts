import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { APP_PORTFOLIO } from "../constant";

i18next
  .use(HttpBackend)
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next)
  .init({
    fallbackLng: APP_PORTFOLIO.LANGUAGE["en-GB"], // Fallback language if detection fails
    ns: ["common"],
    defaultNS: "common",
    supportedLngs: Object.values(APP_PORTFOLIO.LANGUAGE), // List of supported languages
    backend: {
      loadPath: `/locales/{{lng}}/{{ns}}.json`, // Path to translation files
    },
    detection: {
      order: ["navigator", "localStorage"], // Detection order
      caches: ["localStorage"], // Cache the detected language
    },
  });

i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = lng; // Update the HTML `lang` attribute
  document.documentElement.dir = i18next.dir(lng); // Update the text direction
});

export default i18next;
