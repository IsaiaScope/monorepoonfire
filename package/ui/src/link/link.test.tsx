import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import UILink from "./link";

describe("uILink", () => {
  // Test basic link rendering with children content
  // This ensures the component renders as a proper anchor element with content
  it("renders children correctly", () => {
    render(
      <UILink href="https://example.com">
        Test Link
      </UILink>,
    );

    // Verify that the link text is present and the element is an anchor
    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link.tagName.toLowerCase()).toBe("a");
  });

  // Test that the href attribute is properly applied
  // This ensures links navigate to the correct destination
  it("applies href attribute correctly", () => {
    const testUrl = "https://example.com/page";
    render(
      <UILink href={testUrl}>
        Link with href
      </UILink>,
    );

    const link = screen.getByText("Link with href");
    expect(link).toHaveAttribute("href", testUrl);
  });

  // Test that default attributes can be overridden when needed
  // This provides flexibility for different use cases (internal links, etc.)
  it("allows overriding default attributes", () => {
    render(
      <UILink
        href="/internal-page"
        target="_self"
        rel="prefetch"
        tabIndex={-1}
      >
        Internal Link
      </UILink>,
    );

    const link = screen.getByText("Internal Link");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).toHaveAttribute("rel", "prefetch");
    expect(link).toHaveAttribute("tabIndex", "-1");
  });

  // Test that custom CSS classes are properly applied
  // This ensures styling customization works correctly
  it("applies custom className", () => {
    render(
      <UILink href="https://example.com" className="custom-link-class">
        Styled Link
      </UILink>,
    );

    const link = screen.getByText("Styled Link");
    expect(link).toHaveClass("custom-link-class");
  });
});
