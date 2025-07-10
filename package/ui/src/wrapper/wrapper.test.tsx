import { render, screen } from "@testing-library/react";

import UIWrapper from "./wrapper";

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
