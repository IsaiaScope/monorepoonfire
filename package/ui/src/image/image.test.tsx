import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import UIImage from "./image";

describe("testing UIImage", () => {
  // Test basic image rendering with required src attribute
  // This ensures the component renders as an img element with the correct source
  it("renders with src attribute", () => {
    const testSrc = "https://example.com/image.jpg";
    render(<UIImage src={testSrc} alt="Test image" />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", testSrc);
    expect(image).toHaveAttribute("alt", "Test image");
  });

  // Test that images are lazy loaded by default for performance
  // This improves page load times by only loading images when needed
  it("applies lazy loading by default", () => {
    render(<UIImage src="test.jpg" alt="Lazy image" />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  // Test custom className application for styling
  // This ensures the component supports custom styling
  it("applies custom className", () => {
    render(
      <UIImage
        src="test.jpg"
        alt="Styled image"
        className="custom-image-class"
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveClass("custom-image-class");
  });

  // Test fallback image functionality when main image fails to load
  // This provides graceful degradation when images are unavailable
  it("shows fallback image on error", async () => {
    const mainSrc = "broken-image.jpg";
    const fallbackSrc = "fallback-image.jpg";

    render(
      <UIImage
        src={mainSrc}
        fallbackSrc={fallbackSrc}
        alt="Image with fallback"
      />,
    );

    const image = screen.getByRole("img");

    // Initially should have the main source
    expect(image).toHaveAttribute("src", mainSrc);

    // Simulate image load error
    fireEvent.error(image);

    // Should switch to fallback source
    await waitFor(() => {
      expect(image).toHaveAttribute("src", fallbackSrc);
    });
  });

  // Test that fallback only happens once to prevent infinite loops
  // This prevents the component from repeatedly trying fallbacks
  it("does not retry fallback on second error", async () => {
    const mainSrc = "broken-image.jpg";
    const fallbackSrc = "also-broken.jpg";

    render(
      <UIImage
        src={mainSrc}
        fallbackSrc={fallbackSrc}
        alt="Double error image"
      />,
    );

    const image = screen.getByRole("img");

    // First error - should switch to fallback
    fireEvent.error(image);
    await waitFor(() => {
      expect(image).toHaveAttribute("src", fallbackSrc);
    });

    // Second error - should stay on fallback, not retry
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", fallbackSrc);
  });

  // Test behavior when no fallback is provided
  // This ensures the component handles errors gracefully even without fallback
  it("handles error without fallback gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<UIImage src="broken-image.jpg" alt="No fallback image" />);

    const image = screen.getByRole("img");

    // Simulate image load error
    fireEvent.error(image);

    // Should still have original src (no fallback available)
    expect(image).toHaveAttribute("src", "broken-image.jpg");

    consoleSpy.mockRestore();
  });
});
