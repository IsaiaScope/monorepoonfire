import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import UIWrapper from "./wrapper";
// package/ui/src/wrapper/wrapper.test.tsx

describe("testing UIWrapper", () => {
  it("renders children correctly", () => {
    render(
      <UIWrapper tag="main">
        <span>Test Child</span>
      </UIWrapper>,
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("renders with the correct tag", () => {
    const { container } = render(
      <UIWrapper tag="section">
        Section Content
      </UIWrapper>,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(screen.getByText("Section Content")).toBeInTheDocument();
  });

  it("applies default variant class", () => {
    const { container } = render(
      <UIWrapper tag="main">
        Default Variant
      </UIWrapper>,
    );
    expect(container.firstChild).toHaveClass(""); // default is empty string
  });

  it("applies primary variant class", () => {
    const { container } = render(
      <UIWrapper tag="main" variant="primary">
        Primary Variant
      </UIWrapper>,
    );
    expect(container.firstChild).toHaveClass("top-0 left-0 right-0 bottom-0 absolute");
  });

  it("applies secondary variant class", () => {
    const { container } = render(
      <UIWrapper tag="main" variant="secondary">
        Secondary Variant
      </UIWrapper>,
    );
    expect(container.firstChild).toHaveClass("flex flex-col min-h-dvh");
  });

  it("applies additional className", () => {
    const { container } = render(
      <UIWrapper tag="main" className="custom-class">
        Custom Class
      </UIWrapper>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes additional props", () => {
    const { container } = render(
      <UIWrapper tag="main" data-testid="wrapper-test">
        With Data TestId
      </UIWrapper>,
    );
    expect(container.firstChild).toHaveAttribute("data-testid", "wrapper-test");
  });
});
