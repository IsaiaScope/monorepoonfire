import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UIBoundaryError, UIRouterError } from "./error";

// Mock the Button component from shadcn
vi.mock("@package/shadcn", () => ({
  Button: ({ children, onClick, size }: any) => (
    <button type="button" onClick={onClick} data-size={size}>
      {children}
    </button>
  ),
}));

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Globe: () => <svg data-testid="globe-icon">🌍</svg>,
  Route: () => <svg data-testid="route-icon">🛤️</svg>,
}));

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe("testing UIBoundaryError", () => {
  // Test basic rendering of boundary error component
  // This ensures the component displays error UI correctly for React Error Boundary errors
  it("renders boundary error correctly", () => {
    const mockError = new Error("Test boundary error");
    const mockResetErrorBoundary = vi.fn();

    const boundaryProps = {
      error: mockError,
      resetErrorBoundary: mockResetErrorBoundary,
    };

    render(<UIBoundaryError {...boundaryProps} />);

    // Should display the 404 error styling
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();

    // Should have reset button with globe icon
    const resetButton = screen.getByRole("button");
    expect(resetButton).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
  });

  // Test that the reset button calls the resetErrorBoundary function
  // This ensures error recovery functionality works correctly
  it("calls resetErrorBoundary when reset button is clicked", () => {
    const mockError = new Error("Test boundary error");
    const mockResetErrorBoundary = vi.fn();

    const boundaryProps = {
      error: mockError,
      resetErrorBoundary: mockResetErrorBoundary,
    };

    render(<UIBoundaryError {...boundaryProps} />);

    const resetButton = screen.getByRole("button");
    fireEvent.click(resetButton);

    // Should call the reset function
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });

  // Test that error information is logged to console
  // This ensures proper error reporting for debugging
  it("logs boundary error information to console", () => {
    const mockError = new Error("Test boundary error");
    const mockResetErrorBoundary = vi.fn();

    const boundaryProps = {
      error: mockError,
      resetErrorBoundary: mockResetErrorBoundary,
    };

    render(<UIBoundaryError {...boundaryProps} />);

    // Should log error details
    expect(console.error).toHaveBeenCalledWith(
      "[Boundary Error]:",
      expect.objectContaining({
        message: "Test boundary error",
        stack: expect.any(String),
      }),
    );
  });
});

describe("testing UIRouterError", () => {
  // Test basic rendering of router error component
  // This ensures the component displays error UI correctly for Tanstack Router errors
  it("renders router error correctly", () => {
    const mockError = new Error("Test router error");
    const mockReset = vi.fn();
    const mockInfo = { componentStack: "Test component stack" };

    const routerProps = {
      error: mockError,
      reset: mockReset,
      info: mockInfo,
    };

    render(<UIRouterError {...routerProps} />);

    // Should display the 404 error styling
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();

    // Should have reset button with route icon
    const resetButton = screen.getByRole("button");
    expect(resetButton).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByTestId("route-icon")).toBeInTheDocument();
  });

  // Test that the reset button calls the reset function
  // This ensures router error recovery functionality works correctly
  it("calls reset when reset button is clicked", () => {
    const mockError = new Error("Test router error");
    const mockReset = vi.fn();

    const routerProps = {
      error: mockError,
      reset: mockReset,
      info: undefined,
    };

    render(<UIRouterError {...routerProps} />);

    const resetButton = screen.getByRole("button");
    fireEvent.click(resetButton);

    // Should call the reset function
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  // Test that router error information is logged to console
  // This ensures proper error reporting for debugging router issues
  it("logs router error information to console", () => {
    const mockError = new Error("Test router error");
    const mockReset = vi.fn();
    const mockInfo = { componentStack: "Test component stack" };

    const routerProps = {
      error: mockError,
      reset: mockReset,
      info: mockInfo,
    };

    render(<UIRouterError {...routerProps} />);

    // Should log router error details
    expect(console.error).toHaveBeenCalledWith(
      "[Router Error]:",
      expect.objectContaining({
        message: "Test router error",
        stack: "Test component stack",
      }),
    );
  });

  // Test router error without info object
  // This ensures the component handles cases where info might be null
  it("handles router error without info", () => {
    const mockError = new Error("Test router error");
    const mockReset = vi.fn();

    const routerProps = {
      error: mockError,
      reset: mockReset,
      info: undefined,
    };

    render(<UIRouterError {...routerProps} />);

    // Should still render properly
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();

    // Should log error with undefined stack
    expect(console.error).toHaveBeenCalledWith(
      "[Router Error]:",
      expect.objectContaining({
        message: "Test router error",
        stack: undefined,
      }),
    );
  });
});
