// =============================================================================
// PROJECT COMPONENT TESTS - Functionality Tests
// =============================================================================
// Focus on core functionality:
// - Responsive behavior (desktop dialog vs mobile link)
// - Preview image interactions
// - Data passing to child components
// - User interactions (hover, click)
// =============================================================================
import type { TestRenderOptions } from "../../../test/set-up-test";

import { mockProjectsData } from "../../../test/mocks/data/projects";
import { fireEvent, render, screen } from "../../../test/set-up-test";
import Project from "./project";

describe("project component", () => {
  const mockSetPreview = vi.fn();
  // Use the centralized mock instead of creating a local one
  // const mockUseMediaQuery = vi.mocked(useMediaQuery); // Removed - using centralized mock

  // Use the first project from the centralized mock data
  const mockProjectData = {
    ...mockProjectsData[0], // Get first project from centralized mock data
    setPreview: mockSetPreview,
    index: 0,
  };

  const renderProject = (
    props = mockProjectData,
    options: TestRenderOptions = {},
  ) => {
    return render(<Project {...props} />, options);
  };

  // =============================================================================
  // CORE FUNCTIONALITY TESTS
  // =============================================================================

  it("should render project title and tags", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    expect(screen.getAllByText("Test MSW E-commerce Platform")[0]).toBeInTheDocument();
    expect(screen.getByText("#React")).toBeInTheDocument();
    expect(screen.getByText("#TypeScript")).toBeInTheDocument();
    expect(screen.getByText("#Test MSW")).toBeInTheDocument();
  });

  it("should call setPreview with image on hover for devices that support hover", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    const projectContainer = screen.getByTestId("project-container");
    fireEvent.mouseEnter(projectContainer);

    expect(mockSetPreview).toHaveBeenCalledWith(mockProjectData.image);
  });

  it("should call setPreview with null on mouse leave for devices that support hover", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    const projectContainer = screen.getByTestId("project-container");
    fireEvent.mouseLeave(projectContainer);

    expect(mockSetPreview).toHaveBeenCalledWith(null);
  });

  it("should not call setPreview on mobile devices", () => {
    renderProject(mockProjectData); // Uses default mobile viewport

    const projectContainer = screen.getByTestId("project-container");
    fireEvent.mouseEnter(projectContainer);

    expect(mockSetPreview).not.toHaveBeenCalled();
  });

  // =============================================================================
  // RESPONSIVE BEHAVIOR TESTS
  // =============================================================================

  it("should show dialog with 'Read More' button on desktop", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    expect(screen.getByText("Read More")).toBeInTheDocument();
    expect(screen.queryByText("View Project")).not.toBeInTheDocument();
  });

  it("should show external link with 'View Project' on mobile", () => {
    renderProject(mockProjectData); // Uses default mobile viewport

    expect(screen.getByText("View Project")).toBeInTheDocument();
    expect(screen.queryByText("Read More")).not.toBeInTheDocument();
  });

  it("should link to repository on mobile", () => {
    renderProject(mockProjectData); // Uses default mobile viewport

    const viewProjectLink = screen.getByText("View Project").closest("a");
    expect(viewProjectLink).toHaveAttribute("href", mockProjectData.repo);
  });

  // =============================================================================
  // DATA PASSING TESTS
  // =============================================================================

  it("should pass correct props to ProjectDetails component", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    // Open the dialog first
    const readMoreButton = screen.getByRole("button", { name: /read more/i });
    fireEvent.click(readMoreButton);

    // Check for actual ProjectDetails content instead of mock data-testids
    expect(screen.getByRole("heading", { name: mockProjectData.title })).toBeInTheDocument();

    // Check that the project description is rendered in the subDescription paragraphs
    const firstSubDescription = mockProjectData.subDescription[0];
    expect(screen.getByText(firstSubDescription)).toBeInTheDocument();

    // Check that the repo and href links are present
    const viewProjectButton = screen.getByRole("link", { name: /view project/i });
    expect(viewProjectButton).toHaveAttribute("href", mockProjectData.href);

    const repoLink = screen.getByLabelText(/check out the repository/i);
    expect(repoLink).toHaveAttribute("href", mockProjectData.repo);
  });

  // =============================================================================
  // TAGS FUNCTIONALITY TESTS
  // =============================================================================

  it("should render all tags with proper formatting", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    mockProjectData.tags.forEach((tag) => {
      expect(screen.getByText(`#${tag.name}`)).toBeInTheDocument();
    });
  });

  it("should handle empty tags array", () => {
    const propsWithoutTags = { ...mockProjectData, tags: [] };
    renderProject(propsWithoutTags, { viewport: "desktop" });

    expect(screen.getAllByText("Test MSW E-commerce Platform")[0]).toBeInTheDocument();
    expect(screen.queryByText("#React")).not.toBeInTheDocument();
  });

  // =============================================================================
  // INTERACTION TESTS
  // =============================================================================

  it("should handle rapid hover events", () => {
    renderProject(mockProjectData, { viewport: "desktop" });

    const projectContainer = screen.getByTestId("project-container");

    fireEvent.mouseEnter(projectContainer);
    fireEvent.mouseLeave(projectContainer);
    fireEvent.mouseEnter(projectContainer);
    fireEvent.mouseLeave(projectContainer);

    expect(mockSetPreview).toHaveBeenCalledTimes(4);
    expect(mockSetPreview).toHaveBeenNthCalledWith(1, mockProjectData.image);
    expect(mockSetPreview).toHaveBeenNthCalledWith(2, null);
    expect(mockSetPreview).toHaveBeenNthCalledWith(3, mockProjectData.image);
    expect(mockSetPreview).toHaveBeenNthCalledWith(4, null);
  });

  it("should maintain functionality with different setPreview implementations", () => {
    const customSetPreview = vi.fn();
    const customProps = { ...mockProjectData, setPreview: customSetPreview };

    renderProject(customProps, { viewport: "desktop" });

    const projectContainer = screen.getByTestId("project-container");
    fireEvent.mouseEnter(projectContainer);

    expect(customSetPreview).toHaveBeenCalledWith(mockProjectData.image);
    expect(mockSetPreview).not.toHaveBeenCalled();
  });
});
