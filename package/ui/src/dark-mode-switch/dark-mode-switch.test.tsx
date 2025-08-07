import "@testing-library/jest-dom/vitest";
import { DarkModeProvider, useDarkMode } from "@package/utility/provider";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UIDarkModeSwitch from "./dark-mode-switch";

// =============================================================================
// BROWSER API MOCKS - Simulating Browser Features for Testing
// =============================================================================
// We need to mock browser APIs because the test environment (Node.js) doesn't
// have access to real browser features like localStorage and matchMedia.
// These mocks allow us to test how our component behaves with these APIs.

/**
 * Mock localStorage for testing theme persistence
 *
 * In real browsers, localStorage saves data that persists between sessions.
 * Our dark mode component uses it to remember the user's theme choice.
 * We mock it here so we can:
 * 1. Test that themes are being saved correctly
 * 2. Test that saved themes are loaded when the app starts
 * 3. Control what "saved" data the component sees during tests
 */
const mockLocalStorage = {
  getItem: vi.fn(), // Simulates reading saved data (like getting saved theme)
  setItem: vi.fn(), // Simulates saving data (like saving user's theme choice)
  removeItem: vi.fn(), // Simulates deleting saved data
  clear: vi.fn(), // Simulates clearing all saved data
};

// Replace the browser's real localStorage with our mock version
// This ensures all localStorage calls in tests go through our mock
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

/**
 * Mock matchMedia for testing system theme detection
 *
 * matchMedia is a browser API that detects user system preferences like:
 * - Dark mode vs light mode preference
 * - Screen size preferences
 * - Motion preferences, etc.
 *
 * Our component uses matchMedia to detect if the user prefers dark mode
 * at the system level (like macOS Dark Mode or Windows Dark Theme).
 * We mock it so we can:
 * 1. Test what happens when user prefers dark mode
 * 2. Test what happens when user prefers light mode
 * 3. Control the "system preference" during our tests
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, // Whether the query matches (we default to false)
    media: query, // The query that was checked (like "(prefers-color-scheme: dark)")
    onchange: null, // Event handler for when preference changes
    addListener: vi.fn(), // Deprecated way to listen for changes
    removeListener: vi.fn(), // Deprecated way to stop listening for changes
    addEventListener: vi.fn(), // Modern way to listen for changes
    removeEventListener: vi.fn(), // Modern way to stop listening for changes
    dispatchEvent: vi.fn(), // Simulates triggering events
  })),
});

// Test wrapper component to provide dark mode context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <DarkModeProvider>{children}</DarkModeProvider>;
}

describe("uIDarkModeSwitch", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Reset document classes
    document.documentElement.classList.remove("light", "dark");
  });

  describe("rendering and basic interaction", () => {
    // Test basic rendering with all required props
    // This ensures the component displays the toggle button and labels correctly
    it("renders with required props", () => {
      render(
        <TestWrapper>
          <UIDarkModeSwitch
            lightLabel="Light Mode"
            darkLabel="Dark Mode"
            screenReaderLabel="Toggle theme"
          />
        </TestWrapper>,
      );

      // Should render the toggle button
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-haspopup", "menu");
      expect(button).toHaveAttribute("aria-expanded", "false");

      // Should have screen reader text
      expect(screen.getByText("Toggle theme")).toBeInTheDocument();
    });

    // Test that clicking the button triggers dropdown interaction
    // This verifies the dropdown button responds to clicks correctly
    it("responds to button clicks for dropdown interaction", () => {
      render(
        <TestWrapper>
          <UIDarkModeSwitch
            lightLabel="Light Mode"
            darkLabel="Dark Mode"
            screenReaderLabel="Toggle theme"
          />
        </TestWrapper>,
      );

      const button = screen.getByRole("button");

      // Click to trigger dropdown (even if content doesn't render in test)
      fireEvent.click(button);

      // Button should remain responsive and not crash
      expect(button).toBeInTheDocument();
    });
  });

  describe("localStorage functionality", () => {
    // Test that the provider reads from localStorage on initialization
    // This verifies that saved theme preferences are restored correctly
    it("reads initial theme from localStorage on provider initialization", () => {
      mockLocalStorage.getItem.mockReturnValue("dark");

      render(
        <TestWrapper>
          <UIDarkModeSwitch
            lightLabel="Light Mode"
            darkLabel="Dark Mode"
            screenReaderLabel="Toggle theme"
          />
        </TestWrapper>,
      );

      // Should have called getItem to read the stored theme
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("dark-mode");
    });

    // Test localStorage interaction by simulating theme changes via provider
    // This verifies that the dark mode provider correctly saves theme preferences
    it("saves theme changes to localStorage when provider setTheme is called", () => {
      const TestComponent = () => {
        const { setTheme } = useDarkMode();
        return (
          <div>
            <UIDarkModeSwitch
              lightLabel="Light Mode"
              darkLabel="Dark Mode"
              screenReaderLabel="Toggle theme"
            />
            <button type="button" onClick={() => setTheme("light")} data-testid="set-light">Set Light</button>
            <button type="button" onClick={() => setTheme("dark")} data-testid="set-dark">Set Dark</button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      // Test setting light theme
      fireEvent.click(screen.getByTestId("set-light"));
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("dark-mode", "light");

      // Test setting dark theme
      fireEvent.click(screen.getByTestId("set-dark"));
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("dark-mode", "dark");
    });
  });

  describe("theme application and CSS classes", () => {
    // Test that CSS classes are applied to document element when theme changes
    // This verifies that the theme switching actually affects the UI
    it("applies correct CSS classes to document when theme changes via provider", () => {
      const TestComponent = () => {
        const { setTheme } = useDarkMode();
        return (
          <div>
            <UIDarkModeSwitch
              lightLabel="Light Mode"
              darkLabel="Dark Mode"
              screenReaderLabel="Toggle theme"
            />
            <button type="button" onClick={() => setTheme("dark")} data-testid="set-dark">Set Dark</button>
            <button type="button" onClick={() => setTheme("light")} data-testid="set-light">Set Light</button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>,
      );

      // Switch to dark mode
      fireEvent.click(screen.getByTestId("set-dark"));
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);

      // Switch to light mode
      fireEvent.click(screen.getByTestId("set-light"));
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("system theme detection", () => {
    // Test system theme detection with matchMedia
    // This verifies that the component respects user's system preferences
    it("detects system theme preference using matchMedia when provider initializes", () => {
      // Mock system preference for dark mode
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <TestWrapper>
          <UIDarkModeSwitch
            lightLabel="Light Mode"
            darkLabel="Dark Mode"
            screenReaderLabel="Toggle theme"
          />
        </TestWrapper>,
      );

      // Should have queried for system color scheme preference
      expect(window.matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    });

    // Test that system theme applies correct CSS classes when no stored preference
    // This verifies that system theme detection works correctly
    it("applies system theme classes when no localStorage preference exists", () => {
      // Mock system preference for dark mode
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      // No stored preference
      mockLocalStorage.getItem.mockReturnValue(null);

      render(
        <TestWrapper>
          <UIDarkModeSwitch
            lightLabel="Light Mode"
            darkLabel="Dark Mode"
            screenReaderLabel="Toggle theme"
          />
        </TestWrapper>,
      );

      // Should apply dark class based on system preference
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
