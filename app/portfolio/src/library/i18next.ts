// Core i18next library for internationalization
import i18next from "i18next";
// Browser language detection plugin
import LanguageDetector from "i18next-browser-languagedetector";
// HTTP backend for loading translation files
import HttpBackend from "i18next-http-backend";
// React integration for i18next
import { initReactI18next } from "react-i18next";

// Application constants including supported languages
import { APP_PORTFOLIO } from "../constant";

// Configure i18next with plugins and settings
i18next
  .use(HttpBackend) // Enable loading translations from HTTP endpoints
  .use(LanguageDetector) // Enable automatic browser language detection
  .use(initReactI18next) // Enable React integration
  .init({
    fallbackLng: APP_PORTFOLIO.LANGUAGE["en-GB"], // Default language when detection fails or language not supported
    ns: ["common"], // Namespaces to load (translation file categories)
    defaultNS: "common", // Default namespace when none specified
    supportedLngs: Object.values(APP_PORTFOLIO.LANGUAGE), // Array of languages the app supports
    backend: {
      loadPath: `/locales/{{lng}}/{{ns}}.json`, // Template path for translation files (lng=language, ns=namespace)
    },
    detection: {
      order: ["navigator", "localStorage"], // Priority order for language detection: browser setting, then saved preference
      caches: ["localStorage"], // Save detected/selected language to localStorage for persistence
    },
  });

// Event listener that triggers when language changes
i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = lng; // Update HTML lang attribute for accessibility and SEO
  document.documentElement.dir = i18next.dir(lng); // Set text direction (ltr/rtl) based on language
});

// Export configured i18next instance for use throughout the application
export default i18next;
