import { render, screen } from "@testing-library/react";

import UIWrapper from "./wrapper";

describe("testing UIWrapper", () => {
  // Test that the component properly renders its children content
  // This ensures the wrapper doesn't interfere with child content rendering
  it("renders children correctly", () => {
    render(
      <UIWrapper tag="main">
        <span>Test Child</span>
      </UIWrapper>,
    );
    // Verify that the child content is present in the document
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  // Test that the component renders with the correct HTML semantic tag
  // This is important for accessibility and SEO as different tags have different meanings
  it("renders with the correct tag", () => {
    const { container } = render(
      <UIWrapper tag="section">
        Section Content
      </UIWrapper>,
    );
    // Verify that the component renders as a <section> element
    expect(container.querySelector("section")).toBeInTheDocument();
    // Double-check that the content is also present
    expect(screen.getByText("Section Content")).toBeInTheDocument();
  });

  // Test that custom CSS classes are properly applied to the component
  // This ensures styling customization works as expected
  it("applies additional className", () => {
    const { container } = render(
      <UIWrapper tag="main" className="custom-class">
        Custom Class
      </UIWrapper>,
    );
    // Verify that the custom class is applied to the root element
    expect(container.firstChild).toHaveClass("custom-class");
  });

  // Test that additional HTML attributes are properly passed through
  // This ensures the component supports all standard HTML attributes for accessibility and functionality
  it("passes additional props", () => {
    const { container } = render(
      <UIWrapper tag="main" data-testid="wrapper-test">
        With Data TestId
      </UIWrapper>,
    );
    // Verify that custom attributes are applied to the element
    expect(container.firstChild).toHaveAttribute("data-testid", "wrapper-test");
  });
});
