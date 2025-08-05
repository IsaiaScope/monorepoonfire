import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import UIFullPageDotsLoaderOnFire from "./full-page-dots";

describe("testing UIFullPageDotsLoaderOnFire", () => {
  // Test that the component renders the correct number of animated dots
  // and includes proper screen reader accessibility text
  it("renders the correct number of dots and the correct srLabel", () => {
    const dotsCount = 5;
    const srLabel = "[test] srLabel";

    render(
      <UIFullPageDotsLoaderOnFire dotsCount={dotsCount} srLabel={srLabel} />,
    );

    // Verify that exactly the requested number of dots are rendered
    const dots = screen.getAllByTestId("dot");
    expect(dots).toHaveLength(dotsCount);

    // Verify that the screen reader label is present for accessibility
    const span = screen.getByText(srLabel);
    expect(span).toBeInTheDocument();
  });

  // Test default props behavior when no custom props are provided
  // This ensures the component works out of the box with sensible defaults
  it("renders with default props", () => {
    render(<UIFullPageDotsLoaderOnFire />);

    // Should render default 3 dots
    const dots = screen.getAllByTestId("dot");
    expect(dots).toHaveLength(3);

    // Should have default "loading" screen reader text
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  // Test that custom styling can be applied to the container and dots
  // This ensures the component supports customization through className props
  it("applies custom styling correctly", () => {
    const { container } = render(
      <UIFullPageDotsLoaderOnFire
        dotsContainerProps={{ className: "custom-container" }}
        dotProps={{ className: "custom-dot" }}
      />,
    );

    // Container should have custom class
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveClass("custom-container");

    // All dots should have custom class
    const dots = screen.getAllByTestId("dot");
    dots.forEach((dot) => {
      expect(dot).toHaveClass("custom-dot");
    });
  });

  // Test that additional props are passed through correctly
  // This ensures the component supports additional HTML attributes
  it("passes through additional props", () => {
    render(
      <UIFullPageDotsLoaderOnFire
        dotsContainerProps={{ "data-testid": "loader-container" } as any}
        dotProps={{ "data-custom": "dot-attr" } as any}
      />,
    );

    // Container should have custom attribute
    expect(screen.getByTestId("loader-container")).toBeInTheDocument();

    // Dots should have custom attributes
    const dots = screen.getAllByTestId("dot");
    dots.forEach((dot) => {
      expect(dot).toHaveAttribute("data-custom", "dot-attr");
    });
  });
});
