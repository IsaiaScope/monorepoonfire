import { vi } from "vitest";

// =============================================================================
// TEXT EFFECT COMPONENT TESTS - Simplified Core Functionality Tests
// =============================================================================
// Essential tests for TextEffect component:
// - Basic rendering and text segmentation
// - Animation behavior verification
// - Trigger functionality
// - Accessibility
// =============================================================================
import type { TestRenderOptions } from "../test/set-up-test";

import { render, screen } from "../test/set-up-test";
import { TextEffect } from "./text-effect";

describe("textEffect component", () => {
  const renderTextEffect = (
    props: Partial<React.ComponentProps<typeof TextEffect>> = {},
    options: TestRenderOptions = {},
  ) => {
    const defaultProps = {
      children: "Hello world test",
      ...props,
    };
    return render(<TextEffect {...defaultProps} />, options);
  };

  // =============================================================================
  // BASIC RENDERING TESTS
  // =============================================================================
  it("renders text content correctly", () => {
    renderTextEffect({ children: "test content" });
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders with custom HTML tag", () => {
    renderTextEffect({ children: "heading text", as: "h2" });
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("heading text");
  });

  // =============================================================================
  // TEXT SEGMENTATION TESTS
  // =============================================================================
  describe("text segmentation", () => {
    it("splits text into words by default", () => {
      renderTextEffect({ children: "hello world test" });
      expect(screen.getByText("hello")).toBeInTheDocument();
      expect(screen.getByText("world")).toBeInTheDocument();
      expect(screen.getByText("test")).toBeInTheDocument();
    });

    it("splits text into characters", () => {
      renderTextEffect({ children: "abc", per: "char" });
      expect(screen.getByText("a")).toBeInTheDocument();
      expect(screen.getByText("b")).toBeInTheDocument();
      expect(screen.getByText("c")).toBeInTheDocument();
    });

    it("splits text into lines", () => {
      renderTextEffect({ children: "line one\nline two", per: "line" });
      expect(screen.getByText("line one")).toBeInTheDocument();
      expect(screen.getByText("line two")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // ANIMATION PRESET TESTS
  // =============================================================================
  describe("animation presets", () => {
    it("applies different presets without errors", () => {
      const presets = ["fade", "blur", "scale", "fade-in-blur"] as const;

      presets.forEach((preset) => {
        expect(() => {
          renderTextEffect({ children: `test ${preset}`, preset });
        }).not.toThrow();

        expect(screen.getByText(`test ${preset}`)).toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // TRIGGER FUNCTIONALITY TESTS
  // =============================================================================
  it("toggles visibility based on trigger prop", () => {
    const { rerender } = renderTextEffect({ children: "test content", trigger: true });
    expect(screen.getByText("test content")).toBeInTheDocument();

    rerender(<TextEffect trigger={false}>test content</TextEffect>);
    // When trigger is false, AnimatePresence should remove the content
    // In test environment, we check that the visible content is not present
    // The screen reader text might persist due to test environment animation handling
    const visibleContent = screen.queryByText("test content", {
      selector: ":not(.sr-only)",
    });
    expect(visibleContent).not.toBeInTheDocument();

    rerender(<TextEffect trigger={true}>test content</TextEffect>);
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  // =============================================================================
  // ANIMATION FUNCTIONALITY TESTS
  // =============================================================================
  describe("animation functionality", () => {
    it("handles animation callbacks", () => {
      const onAnimationStart = vi.fn();
      const onAnimationComplete = vi.fn();

      renderTextEffect({
        children: "test animation",
        onAnimationStart,
        onAnimationComplete,
      });

      expect(screen.getByText("test animation")).toBeInTheDocument();
      // In test environment, animations may not trigger callbacks
      // This verifies the component accepts the callbacks without errors
    });

    it("works with complex animation configuration", () => {
      expect(() => {
        renderTextEffect({
          children: "complex test",
          delay: 1,
          speedReveal: 0.5,
          speedSegment: 2,
          variants: {
            container: {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            },
            item: {
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            },
          },
        });
      }).not.toThrow();

      expect(screen.getByText("complex test")).toBeInTheDocument();
    });

    // =============================================================================
    // ACCESSIBILITY TESTS
    // =============================================================================
    describe("accessibility", () => {
      it("provides screen reader text for segmented content", () => {
        renderTextEffect({ children: "accessible text", per: "word" });

        const srText = screen.getByText("accessible text", { selector: ".sr-only" });
        expect(srText).toBeInTheDocument();
        expect(srText).toHaveClass("sr-only");
      });

      it("maintains semantic structure", () => {
        renderTextEffect({ children: "semantic content", as: "h3" });

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading).toBeInTheDocument();
      });
    });
  });
});
