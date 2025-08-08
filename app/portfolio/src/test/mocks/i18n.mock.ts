// =============================================================================
// I18N SETUP - Internationalization Configuration
// =============================================================================

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import actual locale resources from the application's public folder
// This ensures tests use the same translations as production
import enGBCommon from "../../../public/locales/en-GB/common.json";
import itITCommon from "../../../public/locales/it-IT/common.json";

// Configure i18next for test environment with actual locale data
i18n.use(initReactI18next).init({
  lng: "en-GB", // Default language for all tests
  fallbackLng: "en-GB", // Language to use if requested language is unavailable
  ns: ["common"], // Namespaces to load (matches production setup)
  defaultNS: "common", // Default namespace when none specified
  initImmediate: false, // Don't initialize immediately - wait for explicit init (important for tests)
  interpolation: { escapeValue: false }, // Don't escape values (React already does this)
  resources: {
    "en-GB": {
      common: enGBCommon, // Load actual English translations from JSON file
    },
    "it-IT": {
      common: itITCommon, // Load actual Italian translations from JSON file
    },
  },
});

// Helper function to change language for tests
export const setLanguage = (language: string) => {
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }
};

export { i18n };
