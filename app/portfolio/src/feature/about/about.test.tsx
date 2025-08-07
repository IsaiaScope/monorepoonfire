/**
 * About Component Comprehensive Test Suite
 *
 * This consolidated test suite validates the About component behavior across all scenarios
 * using both MSW (Mock Service Worker) for HTTP interception and direct hook mocking approaches.
 * The tests cover:
 * - Successful API response rendering for skills
 * - Loading state display with spinners
 * - Error handling (API errors, network failures)
 * - Empty state handling for skills
 * - Component structure and content validation
 * - Skills rendering and interaction
 * - WobbleCard components rendering
 * - Data updates and edge cases
 */

import { APP_HONO } from "@app/hono/constant";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { env } from "../../environment/env";
import { mockSkillsData } from "../../test/mocks/data/skills";
import { server } from "../../test/mocks/server";
import { render, screen, waitFor } from "../../test/set-up-test";
import About from "./about";
import * as useSkillsModule from "./api/use-skills";

// ==============================================================================
// Mock browser APIs and libraries that require DOM/Canvas
// ==============================================================================

// Mock Globe component as a simple div
vi.mock("./component/globe", () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="globe-component">
      Globe Component
    </div>
  ),
}));

/**
 * API endpoint URL constants
 *
 * These constants are constructed from environment variables and app configuration
 * to ensure consistency with the actual API endpoints used by the application.
 * This approach eliminates hard-coded URLs and makes tests more maintainable.
 */
const API_BASE_URL = `${env.VITE_BASE_URL}${APP_HONO.BASE_PATH}`;
const SKILLS_ENDPOINT = `${API_BASE_URL}${APP_HONO.ROUTES.SKILLS}`;

describe("about component", () => {
  describe("skills functionality", () => {
    /**
     * Success: Component renders with skills
     */
    it("should render successfully with skills", async () => {
      render(<About />);

      expect(screen.getByText("About me")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Skills Lab")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
      });
    });

    /**
     * Loading: Shows loading state
     */
    it("should show loading state", async () => {
      server.use(
        http.get(SKILLS_ENDPOINT, async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json(mockSkillsData);
        }),
      );

      render(<About />);

      expect(screen.getByText("Loading skills")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    /**
     * Error: Shows error message on API failure
     */
    it("should show error on API failure", async () => {
      server.use(
        http.get(SKILLS_ENDPOINT, () => HttpResponse.error()),
      );

      render(<About />);

      await waitFor(() => {
        expect(screen.getByText("Oops! Something went wrong while fetching the skills")).toBeInTheDocument();
      });
    });

    /**
     * Empty data: Shows error on empty response
     */
    it("should show error on empty data", async () => {
      server.use(
        http.get(SKILLS_ENDPOINT, () => HttpResponse.json([])),
      );

      render(<About />);

      await waitFor(() => {
        expect(screen.getByText("Oops! Something went wrong while fetching the skills")).toBeInTheDocument();
      });
    });
  });

  describe("component structure", () => {
    /**
     * Static content: All main sections render
     */
    it("should render main content sections", () => {
      const mockUseGetSkills = vi.spyOn(useSkillsModule, "useGetSkills");
      mockUseGetSkills.mockReturnValue({
        data: mockSkillsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useSkillsModule.useGetSkills>);

      render(<About />);

      expect(screen.getByText("About me")).toBeInTheDocument();
      expect(screen.getByText("Hi, I'm Isaia")).toBeInTheDocument();
      expect(screen.getByText("Travelling")).toBeInTheDocument();
      expect(screen.getByText("Tech Stack")).toBeInTheDocument();
      expect(screen.getByTestId("globe-component")).toBeInTheDocument();
    });

    /**
     * Skills section: Renders when data is available
     */
    it("should render skills section with data", () => {
      const mockUseGetSkills = vi.spyOn(useSkillsModule, "useGetSkills");
      mockUseGetSkills.mockReturnValue({
        data: mockSkillsData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useSkillsModule.useGetSkills>);

      render(<About />);

      expect(screen.getByText("Skills Lab")).toBeInTheDocument();

      const skillsSection = screen.getByText("Skills Lab").closest("section");
      expect(skillsSection).toHaveClass("relative");
    });
  });

  describe("hook mocking", () => {
    /**
     * Loading state with hook mock
     */
    it("should handle loading state", () => {
      const mockUseGetSkills = vi.spyOn(useSkillsModule, "useGetSkills");
      mockUseGetSkills.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as ReturnType<typeof useSkillsModule.useGetSkills>);

      render(<About />);

      expect(screen.getByText("Loading skills")).toBeInTheDocument();
      expect(screen.queryByText("Skills Lab")).not.toBeInTheDocument();
    });

    /**
     * Error state with hook mock
     */
    it("should handle error state", () => {
      const mockUseGetSkills = vi.spyOn(useSkillsModule, "useGetSkills");
      mockUseGetSkills.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as ReturnType<typeof useSkillsModule.useGetSkills>);

      render(<About />);

      expect(screen.getByText("Oops! Something went wrong while fetching the skills")).toBeInTheDocument();
      expect(screen.queryByText("Skills Lab")).not.toBeInTheDocument();
    });

    /**
     * Invalid data handling
     */
    it("should handle invalid data", () => {
      const mockUseGetSkills = vi.spyOn(useSkillsModule, "useGetSkills");
      mockUseGetSkills.mockReturnValue({
        data: "invalid", // Simulating invalid data
        isLoading: false,
        isError: false,
      } as unknown as ReturnType<typeof useSkillsModule.useGetSkills>);

      render(<About />);

      expect(screen.getByText("Oops! Something went wrong while fetching the skills")).toBeInTheDocument();
    });
  });
});
