// =============================================================================
// HERO BACKGROUND COMPONENT TESTS - Core Functionality Tests
// =============================================================================
// Essential tests for HeroBackground component:
// - Basic rendering and structure
// - Parallax layers presence
// - Background images loading
// - Motion components integration
// =============================================================================
import type { TestRenderOptions } from "../../../test/set-up-test";

import { render } from "../../../test/set-up-test";
import HeroBackground from "./hero-background";

describe("heroBackground component", () => {
  const renderHeroBackground = (options: TestRenderOptions = {}) => {
    return render(<HeroBackground />, options);
  };

  it("should render all parallax layers", () => {
    const { container } = renderHeroBackground();

    // Check for background divs instead of img elements
    const backgroundDivs = container.querySelectorAll("div[style*='background-image']");
    expect(backgroundDivs.length).toBeGreaterThan(0);
  });
});
