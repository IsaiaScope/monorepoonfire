/**
 * Work Component Comprehensive Test Suite
 *
 * This consolidated test suite validates the Work component behavior across all scenarios
 * using both MSW (Mock Service Worker) for HTTP interception and direct hook mocking approaches.
 * The tests cover:
 * - Successful API response rendering
 * - Loading state display with skeletons
 * - Error handling (API errors, network failures)
 * - Empty state handling
 * - Language filtering functionality
 * - Component structure and content validation
 * - Data updates and edge cases
 */

import { APP_HONO } from "@app/hono/constant";
import { http, HttpResponse } from "msw";

import { env } from "../../environment/env";
import { mockWorkExperiencesData } from "../../test/mocks/data/work-experiences";
import { server } from "../../test/mocks/server";
import { render, screen, waitFor } from "../../test/set-up-test";
import * as useWorkExperienceModule from "./api/use-work-experiences";
import Work from "./work";

const API_BASE_URL = `${env.VITE_BASE_URL}${APP_HONO.BASE_PATH}`;
const WORK_EXPERIENCE_ENDPOINT = `${API_BASE_URL}${APP_HONO.ROUTES.WORK_EXPERIENCE}`;

describe("work component", () => {
  describe("mSW integration tests", () => {
    /**
     * Success Scenario: Work experiences load and display correctly via MSW
     */
    it("should render work experiences successfully when API call succeeds", async () => {
      render(<Work />);

      // Wait for the Work Experience heading to be visible
      expect(screen.getByText("Work Experience")).toBeInTheDocument();

      // Wait for work experiences to load (mobile + desktop). Two roles share this
      // title, so it renders 4 times.
      expect(await screen.findAllByText("Senior Front-End Developer")).toHaveLength(4);

      // Check for specific company name
      await waitFor(() => {
        const companyElements = screen.queryAllByText(/N-and Group Ltd/i);
        expect(companyElements.length).toBeGreaterThan(0);
      });

      // Check for role description
      expect(screen.getByText(/Designing and implementing high-performing user interfaces for vending machine/i)).toBeInTheDocument();
    });

    /**
     * Loading Scenario: Skeleton components display during API call
     */
    it("should display loading skeletons while fetching work experiences", async () => {
      // Mock a delayed API response
      server.use(
        http.get(WORK_EXPERIENCE_ENDPOINT, async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json(mockWorkExperiencesData, { status: 200 });
        }),
      );

      render(<Work />);

      // Verify loading state - should show heading and skeletons
      expect(screen.getByText("Work Experience")).toBeInTheDocument();

      // Verify skeleton components are present during loading
      await waitFor(() => {
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
      });

      // Verify content is not yet present during loading
      expect(screen.queryByText("Senior Front-End Developer")).not.toBeInTheDocument();
    });

    /**
     * Error Scenario: Component handles API errors gracefully
     */
    it("should handle API error gracefully and not render content", async () => {
      server.use(
        http.get(WORK_EXPERIENCE_ENDPOINT, () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      render(<Work />);

      await waitFor(() => {
        expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
      });
    });

    /**
     * Empty State Scenario: Component handles empty data gracefully
     */
    it("should handle empty work experiences list and not render content", async () => {
      server.use(
        http.get(WORK_EXPERIENCE_ENDPOINT, () => {
          return HttpResponse.json([], { status: 200 });
        }),
      );

      render(<Work />);

      await waitFor(() => {
        expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
      });
    });

    /**
     * Language Filtering Scenario: Work experiences filter by language
     */
    it("should filter work experiences by language", async () => {
      render(<Work />, { language: "it-IT" });

      await waitFor(async () => {
        expect(await screen.findAllByText("Sviluppatore Front-End Senior")).toHaveLength(4);
      });

      expect(screen.queryByText("Senior Front-End Developer")).not.toBeInTheDocument();
    });

    /**
     * Network Error Scenario: Component handles network failures
     */
    it("should handle network errors gracefully", async () => {
      server.use(
        http.get(WORK_EXPERIENCE_ENDPOINT, () => {
          return HttpResponse.error();
        }),
      );

      render(<Work />);

      await waitFor(() => {
        expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
      });
    });

    /**
     * Null/Undefined Data Scenario: Component handles malformed data
     */
    it("should handle null/undefined data gracefully", async () => {
      server.use(
        http.get(WORK_EXPERIENCE_ENDPOINT, () => {
          return HttpResponse.json(null, { status: 200 });
        }),
      );

      render(<Work />);

      await waitFor(() => {
        expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
      });
    });
  });

  describe("hook mocking tests", () => {
    /**
     * Success Scenario with Hook Mocking: More reliable component testing
     */
    it("should render work experiences successfully with mocked hook data", async () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: mockWorkExperiencesData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />);

      expect(screen.getByText("Work Experience")).toBeInTheDocument();
      expect(screen.getAllByText("Senior Front-End Developer")).toHaveLength(4);
      expect(screen.getAllByText("N-and Group Ltd")).toHaveLength(2);
      expect(screen.getAllByText("Software Engineer - Analyst")).toHaveLength(2);
      expect(screen.getAllByText("Fincons Group")).toHaveLength(2);

      // Verify company locations are rendered
      expect(screen.getAllByText("Pognano (BG), Italy")).toHaveLength(2);
      expect(screen.getAllByText("Vimercate (MB), Italy")).toHaveLength(2);
    });

    /**
     * Loading State with Hook Mocking: Verify skeleton components
     */
    it("should display loading skeletons while fetching work experiences", async () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />);

      await waitFor(() => {
        expect(screen.getByText("Work Experience")).toBeInTheDocument();
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
      });

      // Verify skeleton structure - should have circular avatars and text lines
      const circularSkeletons = document.querySelectorAll(".rounded-full");
      expect(circularSkeletons.length).toBeGreaterThan(0);
    });

    /**
     * Error State with Hook Mocking: Component returns null on error
     */
    it("should handle API error gracefully and not render content", () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />);

      expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
    });

    /**
     * Empty Data with Hook Mocking: Component returns null when no data
     */
    it("should handle empty work experiences list and not render content", () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: [] as unknown[],
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />);

      expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
    });

    /**
     * Malformed Data with Hook Mocking: Component handles non-array data
     */
    it("should handle non-array data and not render content", () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: "invalid data" as any,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />);

      expect(screen.queryByText("Work Experience")).not.toBeInTheDocument();
    });

    /**
     * Language Filtering with Hook Mocking: Work experiences filter correctly
     */
    it("should filter work experiences by current language", () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: mockWorkExperiencesData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />, { language: "it-IT" });

      // Should show Italian content
      expect(screen.getByText(/Esperienze Lavorative/i)).toBeInTheDocument();
      expect(screen.getAllByText("Sviluppatore Front-End Senior")).toHaveLength(4);

      // Should not show English content
      expect(screen.queryByText("Senior Front-End Developer")).not.toBeInTheDocument();
    });

    /**
     * Loading State Transition: Verify proper state transitions
     */
    it("should transition from loading to content correctly", async () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");

      // Start with loading state
      mockUseGetWorkExperience.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      const { rerender } = render(<Work />);

      // Verify loading state
      expect(screen.getByText("Work Experience")).toBeInTheDocument();
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);

      // Transition to loaded state
      mockUseGetWorkExperience.mockReturnValue({
        data: mockWorkExperiencesData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      rerender(<Work />);

      // Verify content is now shown
      await waitFor(() => {
        expect(screen.getAllByText("Senior Front-End Developer")).toHaveLength(4);
      });
    });

    /**
     * Timeline Component Integration: Verify Timeline receives correct data
     */
    it("should pass filtered data to Timeline component", () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: mockWorkExperiencesData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />);

      // Verify Timeline is rendered with English content
      expect(screen.getAllByText("Senior Front-End Developer")).toHaveLength(4);
      expect(screen.getAllByText("Software Engineer - Analyst")).toHaveLength(2);
      expect(screen.getAllByText("Bachelor's degree in Computer Software Engineering")).toHaveLength(2);
    });
  });

  describe("edge cases and data validation", () => {
    /**
     * Mixed Language Data: Component handles mixed language data appropriately
     */
    it("should handle mixed language data and filter correctly", () => {
      const mixedLanguageData = [
        ...mockWorkExperiencesData.filter(item => item.language === "en-GB"),
        ...mockWorkExperiencesData.filter(item => item.language === "it-IT"),
      ];

      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: mixedLanguageData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      render(<Work />, { language: "en-GB" });

      // Should only show English content
      expect(screen.getAllByText("Senior Front-End Developer")).toHaveLength(4);
      expect(screen.queryByText("Sviluppatore Front-End Senior")).not.toBeInTheDocument();
    });

    /**
     * Component Unmounting: Verify clean unmounting
     */
    it("should unmount cleanly without errors", () => {
      const mockUseGetWorkExperience = vi.spyOn(useWorkExperienceModule, "useGetWorkExperience");
      mockUseGetWorkExperience.mockReturnValue({
        data: mockWorkExperiencesData,
        isLoading: false,
        isError: false,
      } as ReturnType<typeof useWorkExperienceModule.useGetWorkExperience>);

      const { unmount } = render(<Work />);

      expect(() => unmount()).not.toThrow();
    });
  });
});
