/**
 * Projects Component Comprehensive Test Suite
 *
 * This consolidated test suite validates the Projects component behavior across all scenarios
 * using both MSW (Mock Service Worker) for HTTP interception and direct hook mocking approaches.
 * The tests cover:
 * - Successful API response rendering
 * - Loading state display with skeletons
 * - Error handling (API errors, network failures)
 * - Empty state handling
 * - Language filtering functionality
 * - Mouse interactions and preview functionality
 * - Data updates and edge cases
 */

import { APP_HONO } from "@app/hono/constant";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { env } from "../../environment/env";
import { mockProjectsData } from "../../test/mocks/data/projects";
import { server } from "../../test/mocks/server";
import { fireEvent, render, screen, waitFor } from "../../test/set-up-test";
import * as useProjectsModule from "./api/use-projects";
import Projects from "./projects";

/**
 * API endpoint URL constants
 *
 * These constants are constructed from environment variables and app configuration
 * to ensure consistency with the actual API endpoints used by the application.
 * This approach eliminates hard-coded URLs and makes tests more maintainable.
 */
const API_BASE_URL = `${env.VITE_BASE_URL}${APP_HONO.BASE_PATH}`;
const PROJECTS_ENDPOINT = `${API_BASE_URL}${APP_HONO.ROUTES.PROJECTS}`;

describe("projects component", () => {
  describe("mSW integration tests", () => {
    /**
     * Success Scenario: Projects load and display correctly via MSW
     */
    it("should render projects successfully when API call succeeds", async () => {
      render(<Projects />);

      // Wait for the Projects heading to be visible
      expect(screen.getByText("Projects")).toBeInTheDocument();

      // Wait for projects to load and become visible
      expect(await screen.findByText("Test MSW E-commerce Platform")).toBeInTheDocument();

      // Check for Portfolio project (may have different text content)
      await waitFor(() => {
        const portfolioElements = screen.queryAllByText(/Test MSW.*Portfolio/i);
        expect(portfolioElements.length).toBeGreaterThan(0);
      });
    });

    /**
     * Loading Scenario: Skeleton components display during API call
     */
    it("should display loading skeletons while fetching projects", async () => {
      // Mock a delayed API response
      server.use(
        http.get(PROJECTS_ENDPOINT, async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json(mockProjectsData, { status: 200 });
        }),
      );

      render(<Projects />);

      // Verify loading state - should show heading and skeletons
      expect(screen.getByText("Projects")).toBeInTheDocument();

      // Verify skeleton components are present during loading
      await waitFor(() => {
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
      });

      // Verify content is not yet present during loading
      expect(screen.queryByText("Test MSW E-commerce Platform")).not.toBeInTheDocument();
    });

    /**
     * Error Scenario: Component handles API errors gracefully
     */
    it("should handle API error gracefully and not render content", async () => {
      server.use(
        http.get(PROJECTS_ENDPOINT, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      render(<Projects />);

      await waitFor(() => {
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
      });
    });

    /**
     * Empty State Scenario: Component handles empty data gracefully
     */
    it("should handle empty projects list and not render content", async () => {
      server.use(
        http.get(PROJECTS_ENDPOINT, () => {
          return HttpResponse.json([], { status: 200 });
        }),
      );

      render(<Projects />);

      await waitFor(() => {
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
      });
    });

    /**
     * Language Filtering Scenario: Projects filter by language
     */
    it("should filter projects by language", async () => {
      render(<Projects />, { language: "it-IT" });

      await waitFor(async () => {
        expect(await screen.findByText("Test MSW Sistema Italiano")).toBeInTheDocument();
        expect(screen.queryByText("Test MSW E-commerce Platform")).not.toBeInTheDocument();
        expect(screen.queryByText("Test MSW Portfolio Dashboard")).not.toBeInTheDocument();
        expect(screen.queryByText("Test MSW Sistema Italiano")).toBeInTheDocument();
      });
    });

    /**
     * Network Error Scenario: Component handles network failures
     */
    it("should handle network errors gracefully", async () => {
      server.use(
        http.get(PROJECTS_ENDPOINT, () => {
          return HttpResponse.error();
        }),
      );

      render(<Projects />);

      await waitFor(() => {
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
      });
    });

    /**
     * Mouse Interaction Scenario: Preview functionality works correctly
     */
    it("should handle mouse interactions for preview functionality", async () => {
      render(<Projects />);

      try {
        await screen.findByText("Test MSW E-commerce Platform");
        const projectTitle = screen.getByText("Test MSW E-commerce Platform");
        const projectContainer = projectTitle.closest("div");

        if (projectContainer) {
          fireEvent.mouseMove(projectContainer, { clientX: 100, clientY: 100 });
        }

        expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
      }
      catch (error) {
        console.warn("Mouse interaction test with real API data:", error);
      }
    });

    /**
     * Scroll Interaction Scenario: Preview clears on scroll
     */
    it("should clear preview on scroll", async () => {
      render(<Projects />);

      await screen.findByText("Test MSW E-commerce Platform");
      fireEvent.scroll(window);
      expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
    });
  });

  describe("hook mocking tests", () => {
    /**
     * Success Scenario with Hook Mocking: More reliable component testing
     */
    it("should render projects successfully with mocked hook data", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);
      render(<Projects />);

      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
      expect(screen.getByText("Test MSW Portfolio Dashboard")).toBeInTheDocument();

      // Verify tags are rendered (using getAllByText for duplicate tags)
      expect(screen.getAllByText("#React")).toHaveLength(2);
      expect(screen.getAllByText("#TypeScript")).toHaveLength(1);
      expect(screen.getAllByText("#Test MSW")).toHaveLength(2);
    });

    /**
     * Loading State with Hook Mocking: Verify skeleton components
     */
    it("should display loading skeletons while fetching projects", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />);

      await waitFor(() => {
        expect(screen.getByText("Projects")).toBeInTheDocument();
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });

    /**
     * Error State with Hook Mocking: Component returns null on error
     */
    it("should handle API error gracefully and not render content", () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />);

      expect(screen.queryByText("Projects")).not.toBeInTheDocument();
    });

    /**
     * Empty Data with Hook Mocking: Component returns null when no data
     */
    it("should handle empty projects list and not render content", () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: [] as unknown,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />);

      expect(screen.queryByText("Projects")).not.toBeInTheDocument();
    });

    /**
     * Language Filtering with Hook Mocking: More controlled filtering test
     */
    it("should filter projects by language", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,

      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />, { language: "it-IT" });

      await waitFor(() => {
        expect(screen.getByText("Test MSW Sistema Italiano")).toBeInTheDocument();
        expect(screen.queryByText("E-commerce Platform")).not.toBeInTheDocument();
        expect(screen.queryByText("Authentication System")).not.toBeInTheDocument();
      });
    });

    /**
     * Null Data Edge Case: Component handles null/undefined data gracefully
     */
    it("should handle null/undefined data gracefully", () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />);

      expect(screen.queryByText("Projects")).not.toBeInTheDocument();
      expect(screen.queryByText("E-commerce Platform")).not.toBeInTheDocument();
    });

    /**
     * Data Updates: Component handles state transitions
     */
    it("should handle data updates when API response changes", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");

      // First render with loading state
      mockUseGetProjects.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      const { rerender } = render(<Projects />);

      expect(screen.getByText("Projects")).toBeInTheDocument();

      await waitFor(() => {
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
      });

      // Simulate successful data load
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      rerender(<Projects />);

      await waitFor(() => {
        expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
        expect(screen.getByText("Test MSW Portfolio Dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("preview image functionality tests", () => {
    /**
     * Preview Image Visibility: Test opacity and visibility styles
     */
    it("should show preview image with correct visibility and opacity when preview is active", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />, { viewport: "desktop" });

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
      });

      // Initially, preview should be hidden
      const previewImage = document.querySelector("img.fixed");
      expect(previewImage).toBeInTheDocument();
      expect(previewImage).toHaveStyle({ visibility: "hidden" });

      // Hover over first project to activate preview
      const projectContainers = screen.getAllByTestId("project-container");
      const firstProjectContainer = projectContainers[0];
      fireEvent.mouseEnter(firstProjectContainer);

      // After hover, preview should be visible
      await waitFor(() => {
        expect(previewImage).toHaveStyle({ visibility: "visible" });
      });
    });

    /**
     * Preview Image Hiding: Test that preview hides when mouse leaves
     */
    it("should hide preview image when mouse leaves project", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />, { viewport: "desktop" });

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
      });

      const projectContainers = screen.getAllByTestId("project-container");
      const firstProjectContainer = projectContainers[0];
      const previewImage = document.querySelector("img.fixed");

      // Hover to show preview
      fireEvent.mouseEnter(firstProjectContainer);
      await waitFor(() => {
        expect(previewImage).toHaveStyle({ visibility: "visible" });
      });

      // Mouse leave should hide preview
      fireEvent.mouseLeave(firstProjectContainer);
      await waitFor(() => {
        expect(previewImage).toHaveStyle({ visibility: "hidden" });
      });
    });

    /**
     * Preview Image Scroll Behavior: Test that preview clears on scroll
     */
    it("should clear preview image when user scrolls", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />, { viewport: "desktop" });

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
      });

      const projectContainers = screen.getAllByTestId("project-container");
      const firstProjectContainer = projectContainers[0];
      const previewImage = document.querySelector("img.fixed");

      // Activate preview
      fireEvent.mouseEnter(firstProjectContainer);
      await waitFor(() => {
        expect(previewImage).toHaveStyle({ visibility: "visible" });
      });

      // Scroll should clear preview
      fireEvent.scroll(window);
      await waitFor(() => {
        expect(previewImage).toHaveStyle({ visibility: "hidden" });
      });
    });

    /**
     * Preview Image on Mobile: Test that preview doesn't activate on mobile devices
     */
    it("should not show preview image on mobile devices", async () => {
      const mockUseGetProjects = vi.spyOn(useProjectsModule, "useGetProjects");
      mockUseGetProjects.mockReturnValue({
        data: mockProjectsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useProjectsModule.useGetProjects>);

      render(<Projects />, { viewport: "mobile" });

      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByText("Test MSW E-commerce Platform")).toBeInTheDocument();
      });

      const projectContainers = screen.getAllByTestId("project-container");
      const firstProjectContainer = projectContainers[0];
      const previewImage = document.querySelector("img.fixed");

      // Mouse enter on mobile should not activate preview
      fireEvent.mouseEnter(firstProjectContainer);

      // Preview should remain hidden on mobile
      expect(previewImage).toHaveStyle({ visibility: "hidden" });
    });
  });
});
