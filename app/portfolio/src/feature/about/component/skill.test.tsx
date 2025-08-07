import { useRef } from "react";
import { describe, expect, it } from "vitest";

import { mockSkillsData } from "../../../test/mocks/data/skills";
import { render, screen } from "../../../test/set-up-test";
import Skill from "./skill";

describe("skill component", () => {
  const createMockContainer = () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    return container;
  };

  const defaultProps = {
    text: mockSkillsData[0].name, // "React"
    containerRef: { current: createMockContainer() },
    index: 0,
    total: mockSkillsData.length,
  };

  it("should render skill text", () => {
    render(<Skill {...defaultProps} />);

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("should not render when containerRef is null", () => {
    const props = {
      ...defaultProps,
      containerRef: { current: null },
    };

    const { container } = render(<Skill {...props} />);

    expect(container.firstChild).toBeNull();
  });

  it("should handle skill icon loading", () => {
    render(<Skill {...defaultProps} />);

    // Check if image element is rendered (skill icon)
    const image = document.querySelector("img");
    expect(image).toBeInTheDocument();

    if (image) {
      expect(image).toHaveAttribute("src", "assets/react.svg");
      expect(image).toHaveAttribute("alt", "");
    }
  });

  it("should render with proper container ref", () => {
    const TestWrapper = () => {
      const containerRef = useRef<HTMLDivElement>(null);

      return (
        <div ref={containerRef}>
          <Skill
            text={mockSkillsData[1].name} // "TypeScript"
            containerRef={{ current: createMockContainer() }}
            index={1}
            total={mockSkillsData.length}
          />
        </div>
      );
    };

    render(<TestWrapper />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });
});
