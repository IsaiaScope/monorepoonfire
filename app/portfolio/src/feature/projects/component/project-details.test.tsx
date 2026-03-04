import { Dialog } from "@package/shadcn";

// =============================================================================
// PROJECT DETAILS COMPONENT TESTS - Functionality Tests
// =============================================================================
// Focus on core functionality:
// - Content display and structure
// - Link navigation functionality
// - Dialog behavior
// - Data rendering
// =============================================================================
import type { TestRenderOptions } from "../../../test/set-up-test";

import { mockProjectsData } from "../../../test/mocks/data/projects";
import { render, screen } from "../../../test/set-up-test";
import ProjectDetails from "./project-details";

describe("project details component", () => {
  // Use the first project from the centralized mock data
  const mockProjectData = mockProjectsData[0];

  const renderProjectDetails = (
    props = mockProjectData,
    options: TestRenderOptions = {},
  ) => {
    return render(
      <Dialog open={true}>
        <ProjectDetails {...props} />
      </Dialog>,
      options,
    );
  };

  // =============================================================================
  // CONTENT DISPLAY TESTS
  // =============================================================================

  it("should display all project content correctly", () => {
    renderProjectDetails();

    // Title display
    expect(screen.getByText("Portfolio")).toBeInTheDocument();

    // Image display
    const image = screen.getByRole("presentation");
    expect(image).toHaveAttribute("src", mockProjectData.image);

    // Sub-descriptions
    expect(screen.getByText(/A modern full-stack web application built with React/)).toBeInTheDocument();
    expect(screen.getByText(/PostgreSQL database with Docker containerization/)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Actions CI\/CD pipeline/)).toBeInTheDocument();

    // Screen reader description
    expect(screen.getByText(/A modern full-stack portfolio built with React and Hono/)).toBeInTheDocument();
  });

  // =============================================================================
  // LINK FUNCTIONALITY TESTS
  // =============================================================================

  it("should handle all link functionality and accessibility", () => {
    renderProjectDetails();

    // Repository link
    const repoLink = screen.getByLabelText("Check out the repository");
    expect(repoLink.closest("a")).toHaveAttribute("href", mockProjectData.repo);

    // Project URL link
    const projectLink = screen.getByText("View Project").closest("a");
    expect(projectLink).toHaveAttribute("href", mockProjectData.href);

    // Accessible labels for action buttons
    expect(screen.getByLabelText("Check out the repository")).toBeInTheDocument();
    expect(screen.getByText("View Project")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  // =============================================================================
  // DATA HANDLING TESTS
  // =============================================================================

  it("should handle various sub-description scenarios", () => {
    // Empty sub-descriptions array
    const propsWithEmptySubDesc = { ...mockProjectData, subDescription: [] };
    const { container, unmount } = renderProjectDetails(propsWithEmptySubDesc);

    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    const paragraphs = container.querySelectorAll("p");
    const subDescParagraphs = Array.from(paragraphs).filter(p =>
      p.textContent && !p.textContent.includes("A modern full-stack portfolio built with React and Hono"),
    );
    expect(subDescParagraphs).toHaveLength(0);

    unmount();

    // Single sub-description
    const propsWithSingleSubDesc = {
      ...mockProjectData,
      subDescription: ["Single feature description"],
    };
    const { unmount: unmount2 } = renderProjectDetails(propsWithSingleSubDesc);
    expect(screen.getByText("Single feature description")).toBeInTheDocument();

    unmount2();

    // Long sub-description
    const propsWithLongSubDesc = {
      ...mockProjectData,
      subDescription: [
        "This is a very long feature description that should still be displayed correctly without breaking the layout or functionality of the component",
      ],
    };
    const { unmount: unmount3 } = renderProjectDetails(propsWithLongSubDesc);
    expect(screen.getByText(/This is a very long feature description/)).toBeInTheDocument();

    unmount3();

    // Special characters in content
    const propsWithSpecialChars = {
      ...mockProjectData,
      title: "Test & Project <with> \"Special\" Characters",
      subDescription: ["Feature with <HTML> & special chars", "Another feature @ 100% completion"],
    };
    renderProjectDetails(propsWithSpecialChars);

    expect(screen.getByText("Test & Project <with> \"Special\" Characters")).toBeInTheDocument();
    expect(screen.getByText("Feature with <HTML> & special chars")).toBeInTheDocument();
    expect(screen.getByText("Another feature @ 100% completion")).toBeInTheDocument();
  });

  // =============================================================================
  // ACCESSIBILITY AND SEMANTIC STRUCTURE TESTS
  // =============================================================================

  it("should provide proper accessibility and semantic structure", () => {
    renderProjectDetails();

    // Semantic structure
    expect(screen.getByRole("heading", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByRole("presentation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    // Keyboard navigation support - all interactive elements should be focusable
    const interactiveElements = [
      screen.getByLabelText("Check out the repository"),
      screen.getByRole("button", { name: "Close" }),
      screen.getByText("View Project"),
    ];

    interactiveElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
});
