// test-utils.tsx
// =============================================================================
// Test utilities for React components with all necessary providers and mocks
// This file centralizes all test setup, mocking, and provider configuration
//
// USAGE:
// - Default render() function includes routing, media queries, and i18n mocks
// - For motion animations, import { createFramerMotionMock } from './mocks' in individual test files
// - Mock helpers are available from './mocks' for fine-grained control
// =============================================================================

// Extends Jest matchers with DOM-specific assertions like toBeInTheDocument()
import "@testing-library/jest-dom";

import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render } from "@testing-library/react";
import React from "react";
import { I18nextProvider } from "react-i18next";

// Import mock modules
import { i18n, setLanguage } from "./mocks/i18n.mock";
import { setupIntersectionObserverMock } from "./mocks/intersection-observer.mock";
import { setViewport } from "./mocks/media-query.mock";
import { mockRouterContext } from "./mocks/router.mock";
import { server } from "./mocks/server";

setupIntersectionObserverMock();

// Extend React Testing Library's RenderOptions with our custom test options
// Omit<RenderOptions, "wrapper"> removes the wrapper property since we provide our own
export type TestRenderOptions = Omit<RenderOptions, "wrapper"> & {
  location?: { pathname: string }; // Mock router location (which page we're on)
  viewport?: "mobile" | "tablet" | "desktop"; // Control viewport size (mobile-first: defaults to mobile)
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
    viewport = "mobile", // MOBILE-FIRST: Default to mobile viewport
    language = "en-GB", // Default to English
  } = options;

  // =============================================================================
  // MOCK UPDATES - Configure mocks based on test options
  // =============================================================================

  // Update router mock to simulate the requested route
  mockRouterContext.location = location;

  // Configure viewport for media queries
  setViewport(viewport);

  // Change i18n language if different from current
  setLanguage(language);

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

// MSW Server Setup - Enable request interception for all tests
beforeAll(() => {
  // Start MSW server to intercept HTTP requests
  server.listen({ onUnhandledRequest: "warn" });
});

// Reset MSW handlers after each test to prevent test interference
afterEach(() => {
  cleanup(); // Remove all rendered components from DOM
  server.resetHandlers(); // Reset MSW handlers to defaults
  vi.clearAllMocks();
});

// Clean up MSW server after all tests complete
afterAll(() => {
  server.close();
});
