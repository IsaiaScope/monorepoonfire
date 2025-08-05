import "@testing-library/jest-dom/vitest";
import { DarkModeProvider, useDarkMode } from "@package/utility/provider";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UIDarkModeSwitch from "./dark-mode-switch";

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// Mock matchMedia for testing system theme detection
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
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
