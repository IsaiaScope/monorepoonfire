// test-utils.tsx
// =============================================================================
// Test utilities for React components with all necessary providers and mocks
// This file centralizes all test setup, mocking, and provider configuration
// =============================================================================

// Extends Jest matchers with DOM-specific assertions like toBeInTheDocument()
import "@testing-library/jest-dom";

import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render } from "@testing-library/react";
import i18n from "i18next";
import React from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { afterEach, vi } from "vitest";

// Import actual locale resources from the application's public folder
// This ensures tests use the same translations as production
import enGBCommon from "../../public/locales/en-GB/common.json";
import itITCommon from "../../public/locales/it-IT/common.json";

// =============================================================================
// I18N SETUP - Internationalization Configuration
// =============================================================================

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

// =============================================================================
// ROUTER MOCKS - TanStack Router Mocking
// =============================================================================

// Mock context object that simulates router state
// This object will be mutated by tests to simulate different routes/states
const mockRouterContext = {
  location: { pathname: "/" }, // Current route path (default to home)
  navigate: vi.fn(), // Mock navigation function (Vitest mock function)
  search: {}, // URL search parameters (query strings)
  params: {}, // Route parameters (e.g., /user/:id -> { id: "123" })
};

// Mock the entire @tanstack/react-router module
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router"); // Import real module first
  return {
    ...actual, // Spread all actual exports
    // Override specific hooks with mocked versions:
    useLocation: vi.fn(() => mockRouterContext.location), // Returns mocked location
    useNavigate: vi.fn(() => mockRouterContext.navigate), // Returns mocked navigate function
    useSearch: vi.fn(() => mockRouterContext.search), // Returns mocked search params
    useParams: vi.fn(() => mockRouterContext.params), // Returns mocked route params
    // Mock Link component to render as simple anchor tag for testing
    Link: ({ to, children, className, ...props }: any) =>
      React.createElement("a", { href: to, className, ...props }, children),
  };
});

// =============================================================================
// MEDIA QUERY MOCKS - Responsive Design Testing
// =============================================================================

// Mock function for react-responsive's useMediaQuery hook
// Default returns false (simulates desktop view when no mobile override)
const mockUseMediaQuery = vi.fn(() => false);

// Mock the react-responsive module used for responsive design
vi.mock("react-responsive", () => ({
  useMediaQuery: mockUseMediaQuery, // Replace real hook with our mock
}));

// =============================================================================
// TYPE DEFINITIONS - Custom Test Options
// =============================================================================

// Extend React Testing Library's RenderOptions with our custom test options
// Omit<RenderOptions, "wrapper"> removes the wrapper property since we provide our own
export type TestRenderOptions = Omit<RenderOptions, "wrapper"> & {
  location?: { pathname: string }; // Mock router location (which page we're on)
  isMobile?: boolean; // Control mobile vs desktop rendering (mobile-first: defaults to true)
  language?: string; // Set i18n language for the test ("en-GB" | "it-IT")
};

// Default options object - used when no options are provided to render()
const defaultOptions: TestRenderOptions = {};

// =============================================================================
// TEST PROVIDERS - Wrapper Component for All Required Providers
// =============================================================================

// eslint-disable-next-line react-refresh/only-export-components
function TestProviders({
  children, // The component being tested
  options = defaultOptions, // Test configuration options
}: {
  children: React.ReactNode;
  options?: TestRenderOptions;
}) {
  // Destructure options with defaults (mobile-first approach)
  const {
    location = { pathname: "/" }, // Default to home page
    isMobile = true, // MOBILE-FIRST: Default to mobile view
    language = "en-GB", // Default to English
  } = options;

  // =============================================================================
  // MOCK UPDATES - Configure mocks based on test options
  // =============================================================================

  // Update router mock to simulate the requested route
  mockRouterContext.location = location;

  // CRITICAL: Media query logic inversion
  // isMobile: true  -> mockUseMediaQuery returns false (mobile media query doesn't match)
  // isMobile: false -> mockUseMediaQuery returns true  (desktop media query matches)
  // This inversion is necessary because media queries typically check for "min-width"
  mockUseMediaQuery.mockReturnValue(!isMobile);

  // Change i18n language if different from current
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  // =============================================================================
  // PROVIDER SETUP - Create fresh instances for each test
  // =============================================================================

  // Create a new QueryClient for each test to avoid state leakage
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Don't retry failed queries in tests (faster, more predictable)
    },
  });

  // =============================================================================
  // PROVIDER TREE - Wrap component with all necessary providers
  // =============================================================================

  return (
    // TanStack Query Provider - Manages server state caching and synchronization
    <QueryClientProvider client={queryClient}>
      {/* i18next Provider - Provides internationalization context */}
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </QueryClientProvider>
  );
}

// =============================================================================
// CUSTOM RENDER FUNCTION - Enhanced render with automatic provider wrapping
// =============================================================================

// Custom render function that automatically wraps components with all necessary providers
const customRender = (
  ui: ReactElement, // The React component/element to render
  options?: TestRenderOptions, // Optional test configuration
) => {
  return render(ui, {
    // Provide our TestProviders as the wrapper component
    // This ensures every rendered component has access to:
    // - TanStack Query context
    // - i18next internationalization
    // - Mocked router context
    // - Mocked media queries
    wrapper: ({ children }) => (
      <TestProviders options={options}>{children}</TestProviders>
    ),
    ...options, // Spread any additional RTL options
  });
};

// =============================================================================
// EXPORTS - Re-export Testing Library functions and custom utilities
// =============================================================================

// Re-export specific testing library functions for convenient importing
export {
  cleanup, // Function to unmount components and clear DOM (used in afterEach)
  findByRole, // Async query that waits for element with specific role
  findByTestId, // Async query that waits for element with data-testid
  findByText, // Async query that waits for element with specific text
  fireEvent, // Function to trigger events (click, change, etc.)
  getByRole, // Synchronous query for element with specific role (throws if not found)
  getByTestId, // Synchronous query for element with data-testid (throws if not found)
  getByText, // Synchronous query for element with text (throws if not found)
  queryByRole, // Synchronous query for element with role (returns null if not found)
  queryByTestId, // Synchronous query for element with data-testid (returns null if not found)
  queryByText, // Synchronous query for element with text (returns null if not found)
  screen, // Object containing all query functions scoped to document.body
  waitFor, // Utility to wait for async operations to complete
  waitForElementToBeRemoved, // Waits for element to be removed from DOM
  within, // Scopes queries to a specific container element
} from "@testing-library/react";

// Export our enhanced render function as the default render
// This replaces the standard RTL render with our provider-wrapped version
export { customRender as render };

// =============================================================================
// GLOBAL TEST SETUP - Automatic cleanup after each test
// =============================================================================

// Automatically cleanup after each test to prevent DOM pollution
// This ensures each test starts with a clean slate
afterEach(() => {
  cleanup(); // Remove all rendered components from DOM
});
