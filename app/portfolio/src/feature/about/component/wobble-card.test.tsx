import { render, screen } from "../../../test/set-up-test";
import { WobbleCard } from "./wobble-card";

describe("wobble card component", () => {
  it("should render children content", () => {
    render(
      <WobbleCard>
        <div data-testid="test-content">Card Content</div>
      </WobbleCard>,
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("should render noise background element", () => {
    render(
      <WobbleCard>
        <div>Content</div>
      </WobbleCard>,
    );

    // Check for noise background div
    const noiseElement = document.querySelector("[style*='noise.webp']");
    expect(noiseElement).toBeInTheDocument();
  });

  it("should have proper default structure", () => {
    render(
      <WobbleCard>
        <div>Content</div>
      </WobbleCard>,
    );

    // Check for main section element
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });
});
