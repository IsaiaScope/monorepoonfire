// =============================================================================
// FLIP WORDS COMPONENT TESTS - Core Functionality Tests
// =============================================================================
// Essential tests for FlipWords component:
// - Basic rendering with words array
// - Word cycling functionality
// - Animation timing behavior
// - Props validation
// =============================================================================
import type { TestRenderOptions } from "../../../test/set-up-test";

import { render, screen, waitFor } from "../../../test/set-up-test";
import FlipWords from "./flip-words";

describe("flipWords component", () => {
  const renderFlipWords = (
    props: Partial<React.ComponentProps<typeof FlipWords>> = {},
    options: TestRenderOptions = {},
  ) => {
    const defaultProps = {
      words: ["Hello", "World", "Test"],
      ...props,
    };
    return render(<FlipWords {...defaultProps} />, options);
  };

  it("should render the first word initially", () => {
    renderFlipWords();
    // Since the component splits words into individual letters, check for the container
    const container = screen.getByText("H").closest("div");
    expect(container).toBeInTheDocument();
    // Check that all letters of "Hello" are present
    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("e")).toBeInTheDocument();
    expect(screen.getAllByText("l")).toHaveLength(2); // Two l's in Hello
    expect(screen.getByText("o")).toBeInTheDocument();
  });

  // =============================================================================
  // WORD CYCLING FUNCTIONALITY
  // =============================================================================

  it("should cycle through words after duration", async () => {
    const words = ["First", "Second", "Third"];
    renderFlipWords({ words, duration: 100 });

    // Initially shows first word letters
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByText("i")).toBeInTheDocument();

    // Should show second word after duration
    await waitFor(() => {
      expect(screen.getByText("S")).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it("should cycle back to first word after reaching the end", async () => {
    const words = ["Alpha", "Beta"];
    renderFlipWords({ words, duration: 50 });

    // Start with first word
    expect(screen.getByText("A")).toBeInTheDocument();

    // Cycle to second word
    await waitFor(() => {
      expect(screen.getByText("B")).toBeInTheDocument();
    }, { timeout: 100 });

    // Cycle back to first word
    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
    }, { timeout: 150 });
  });
});
