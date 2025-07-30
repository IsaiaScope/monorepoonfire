// vitest-setup.tsx
// =============================================================================
// This file sets up the testing environment for React components in our portfolio app.
// It configures all necessary providers (i18n, React Query, Router) and mocks
// external dependencies to create isolated, predictable test environments.
// =============================================================================

import "@testing-library/jest-dom"; // Extends Jest matchers for DOM testing

import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import i18n from "i18next";
import React from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { vi } from "vitest";

// =============================================================================
// I18N SETUP
// =============================================================================
// Configure internationalization for testing with predefined translations.
// This ensures consistent translation behavior across all tests without
// depending on external translation files.

// Initialize i18next for testing with initImmediate: false for synchronous setup
i18n.use(initReactI18next).init({
  lng: "en-GB", // Default language for tests
  fallbackLng: "en-GB", // Fallback if translation key is missing
  initImmediate: false, // Initialize synchronously for tests
  interpolation: {
    escapeValue: false, // React already does XSS protection
  },
  resources: {
    // English translations - used as default in most tests
    "en-GB": {
      translation: {
        "Home": "Home",
        "About": "About",
        "Work": "Work",
        "Projects": "Projects",
        "Contact": "Contact",
        "Menu": "Menu",
        "Dark": "Dark",
        "Light": "Light",
        "Toggle dark mode": "Toggle dark mode",
        "English": "English",
        "Italian": "Italian",
        "This is the menu for the app. Use the links below to navigate":
          "This is the menu for the app. Use the links below to navigate",
      },
    },
    // Italian translations - used for testing language switching
    "it-IT": {
      translation: {
        "Home": "Casa",
        "About": "Chi Sono",
        "Work": "Lavoro",
        "Projects": "Progetti",
        "Contact": "Contatti",
        "Menu": "Menu",
        "Dark": "Scuro",
        "Light": "Chiaro",
        "Toggle dark mode": "Attiva modalità scura",
        "English": "Inglese",
        "Italian": "Italiano",
        "This is the menu for the app. Use the links below to navigate":
          "Questo è il menu dell'app. Usa i link qui sotto per navigare",
      },
    },
  },
});

// =============================================================================
// TANSTACK ROUTER MOCKS
// =============================================================================
// Mock router context and hooks to isolate components from routing dependencies.
// This allows testing component behavior without setting up complex routing scenarios.

const mockRouterContext = {
  location: { pathname: "/" }, // Current route location
  navigate: vi.fn(), // Mock navigation function
  search: {}, // URL search parameters
  params: {}, // Route parameters
};

// Mock the entire @tanstack/react-router module
vi.mock("@tanstack/react-router", async () => {
  // Import actual module to preserve non-hook exports
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    // Mock router hooks to return predictable values
    useLocation: vi.fn(() => mockRouterContext.location),
    useNavigate: vi.fn(() => mockRouterContext.navigate),
    useSearch: vi.fn(() => mockRouterContext.search),
    useParams: vi.fn(() => mockRouterContext.params),
    // Mock Link component as a simple anchor tag for testing
    Link: ({ to, children, className, ...props }: any) =>
      React.createElement("a", { href: to, className, ...props }, children),
  };
});

// =============================================================================
// REACT RESPONSIVE MOCKS
// =============================================================================
// Mock useMediaQuery hook to control responsive behavior in tests.
// This allows testing both desktop and mobile views deterministically.

const mockUseMediaQuery = vi.fn(() => true); // Default to desktop view (large screen)

vi.mock("react-responsive", () => ({
  useMediaQuery: mockUseMediaQuery,
}));

// =============================================================================
// PROVIDER WRAPPERS
// =============================================================================
// Create reusable wrapper functions for different providers.
// This modular approach makes it easy to combine providers and maintain test setup.

type WrapperProps = {
  children: React.ReactNode;
};

/**
 * Wraps children with I18nextProvider for internationalization support
 * @param children - React components to wrap
 * @returns JSX element with i18n context
 */
function createI18nWrapper(children: React.ReactNode) {
  return React.createElement(I18nextProvider, { i18n }, children);
}

/**
 * Wraps children with QueryClientProvider for React Query support
 * @param queryClient - Configured QueryClient instance
 * @param children - React components to wrap
 * @returns JSX element with React Query context
 */
function createQueryWrapper(queryClient: QueryClient, children: React.ReactNode) {
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

/**
 * Combines all providers into a single wrapper function
 * @param queryClient - Configured QueryClient instance
 * @param children - React components to wrap
 * @returns JSX element with all necessary providers
 */
function createAllProvidersWrapper(queryClient: QueryClient, children: React.ReactNode) {
  return createI18nWrapper(
    createQueryWrapper(queryClient, children),
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
// Utility functions to update mock states during tests.
// These allow tests to simulate different application states easily.

/**
 * Updates the mock router context with a new location
 * Useful for testing components that behave differently based on current route
 */
const updateRouterContext = (location: { pathname: string }) => {
  mockRouterContext.location = location;
};

/**
 * Updates the media query mock to simulate desktop/mobile views
 * @param isDesktop - true for desktop view, false for mobile
 */
const updateMediaQuery = (isDesktop: boolean) => {
  mockUseMediaQuery.mockReturnValue(isDesktop);
};

/**
 * Changes the active language in i18n
 * Useful for testing internationalization features
 */
const changeLanguage = (language: string) => {
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }
};

/**
 * Creates a new QueryClient configured for testing
 * Disables retries to make tests faster and more predictable
 */
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
      },
    },
  });
};

/**
 * Debug utility to log HTML content during tests
 * Helpful for understanding test failures and component rendering
 */
const debugHTML = (container: Element, title = "Current HTML") => {
  // eslint-disable-next-line no-console
  console.log(`\n=== ${title} ===`);
  // eslint-disable-next-line no-console
  console.log(container);
  // eslint-disable-next-line no-console
  console.log("==================\n");
};

// =============================================================================
// CUSTOM RENDER FUNCTION
// =============================================================================
// Enhanced render function that automatically sets up all necessary providers
// and allows easy configuration of test scenarios through options.

export type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  location?: { pathname: string }; // Mock current route location
  isDesktop?: boolean; // Mock screen size (desktop vs mobile)
  language?: string; // Set active language
  debug?: boolean; // Enable HTML debugging output
  debugTitle?: string; // Custom title for debug output
};

/**
 * Custom render function that wraps components with all necessary providers
 *
 * @param ui - The React component to render
 * @param options - Configuration options for the test environment
 * @returns Testing Library render result with additional debug capabilities
 *
 * Usage examples:
 * - Basic: render(<MyComponent />)
 * - Mobile view: render(<MyComponent />, { isDesktop: false })
 * - Different route: render(<MyComponent />, { location: { pathname: "/about" } })
 * - Italian language: render(<MyComponent />, { language: "it-IT" })
 * - With debugging: render(<MyComponent />, { debug: true })
 */
export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
) => {
  const {
    location = { pathname: "/" }, // Default to home page
    isDesktop = true, // Default to desktop view
    language = "en-GB", // Default to English
    debug = false, // Debug disabled by default
    debugTitle = "Test HTML", // Default debug title
    ...renderOptions // Pass through other render options
  } = options;

  // Configure mock states based on options
  updateRouterContext(location);
  updateMediaQuery(isDesktop);
  changeLanguage(language);

  // Create a fresh QueryClient for this test
  const queryClient = createQueryClient();

  // Create wrapper component that provides all contexts
  const Wrapper = ({ children }: WrapperProps) =>
    createAllProvidersWrapper(queryClient, children);

  // Render the component with all providers
  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  // Output debug information if requested
  if (debug) {
    debugHTML(result.container, debugTitle);
  }

  return result;
};

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

// Export utilities for advanced test scenarios
export const testUtils = {
  updateRouterContext,
  updateMediaQuery,
  changeLanguage,
  createQueryClient,
  debugHTML,
  mockRouterContext,
  mockUseMediaQuery,
  i18n,
};

// Re-export everything from testing-library/react except render
export {
  cleanup,
  findByRole,
  findByTestId,
  findByText,
  fireEvent,
  getByRole,
  getByTestId,
  getByText,
  queryByRole,
  queryByTestId,
  queryByText,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";

// Override the default render with our custom render
export { customRender as render };
