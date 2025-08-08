// =============================================================================
// HERO TEXT COMPONENT TESTS - Core Functionality Tests
// =============================================================================
// Essential tests for HeroText component:
// - Basic rendering and text content
// - Translation integration
// - Responsive behavior
// - Animation elements presence
// =============================================================================
import type { TestRenderOptions } from "../../../test/set-up-test";

import { setLanguage } from "../../../test/mocks/i18n.mock";
import { setViewport } from "../../../test/mocks/media-query.mock";
import { render, screen } from "../../../test/set-up-test";
import HeroText from "./hero-text";

describe("heroText component", () => {
  const renderHeroText = (options: TestRenderOptions = {}) => {
    return render(<HeroText />, options);
  };

  it("should render flip words component with adjectives", () => {
    renderHeroText();
    // Check if one of the flip words letters is present (they cycle and are split into letters)
    const flipWordLetter = screen.getByText("R"); // First letter of "Robust"
    expect(flipWordLetter).toBeInTheDocument();
  });

  it("should render creating text for mobile", () => {
    setViewport("mobile");
    renderHeroText();
    expect(screen.getByText("Creating")).toBeInTheDocument();
  });

  it("should render translated content", () => {
    setLanguage("en");
    renderHeroText();
    expect(screen.getByText("Hi, I'm Isaia")).toBeInTheDocument();
    expect(screen.getByText("Web Solutions")).toBeInTheDocument();
  });

  it("should apply responsive classes for large screens", () => {
    setViewport("desktop"); // Large screen
    renderHeroText();

    const section = screen.getByRole("heading", { level: 1 }).closest("section");
    expect(section).toHaveClass("lg:text-left");
  });

  it("should apply responsive classes for small screens", () => {
    setViewport("mobile"); // Small screen
    renderHeroText();

    const section = screen.getByRole("heading", { level: 1 }).closest("section");
    expect(section).toHaveClass("text-center");
  });
});
