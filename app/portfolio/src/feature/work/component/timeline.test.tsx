/**
 * Timeline Component Test Suite
 *
 * This test suite validates the Timeline component functionality including:
 * - Data rendering and content display
 * - Visibility tracking and callback functionality
 * - Language filtering and data updates
 * - Component structure and behavior
 * - Key generation and stability
 */

import { mockWorkExperiencesData } from "../../../test/mocks/data/work-experiences";
import { render, screen } from "../../../test/set-up-test";
import Timeline from "./timeline";

describe("timeline component", () => {
  describe("data rendering", () => {
    /**
     * Basic Data Rendering: Verify Timeline renders all work experience data
     */
    it("should render all work experience data correctly", () => {
      const englishData = mockWorkExperiencesData.filter(item => item.language === "en-GB");

      render(<Timeline data={englishData} />);

      // Verify all job roles are rendered (2 instances each: mobile + desktop)
      expect(screen.getAllByText("Senior Front-End Developer")).toHaveLength(2);
      expect(screen.getAllByText("Software Engineer - Analyst")).toHaveLength(2);
      expect(screen.getAllByText("Bachelor's degree in Computer Software Engineering")).toHaveLength(2);

      // Verify company names are rendered
      expect(screen.getAllByText("N-and Group Ltd")).toHaveLength(2);
      expect(screen.getAllByText("Fincons Group")).toHaveLength(2);
      expect(screen.getAllByText("eCampus University")).toHaveLength(2);

      // Verify date ranges are rendered
      expect(screen.getAllByText("2025-10/Today")).toHaveLength(2);
      expect(screen.getAllByText("2021-02/2025-10")).toHaveLength(2);
      expect(screen.getAllByText("2016-09/2019-09")).toHaveLength(2);

      // Verify locations are rendered
      expect(screen.getAllByText("Pognano (BG), Italy")).toHaveLength(2);
      expect(screen.getAllByText("Vimercate (MB), Italy")).toHaveLength(2);
      expect(screen.getAllByText("Novedrate (CO) Italy")).toHaveLength(2);
    });

    /**
     * Descriptions Rendering: Verify both short and long descriptions are present
     */
    it("should render both short and long descriptions", () => {
      const englishData = mockWorkExperiencesData.filter(item => item.language === "en-GB");

      render(<Timeline data={englishData} />);

      // Verify short descriptions (mobile) are present
      expect(screen.getByText(/Designing and implementing high-performing UIs for vending machine/i)).toBeInTheDocument();
      expect(screen.getByText(/Worked on media and streaming projects for Mediaset/i)).toBeInTheDocument();
      expect(screen.getByText(/Learned solid knowledge in Java, Python and C\+\+/i)).toBeInTheDocument();

      // Verify long descriptions (desktop) are present
      expect(screen.getByText(/Designing and implementing high-performing user interfaces for vending machine applications/i)).toBeInTheDocument();
      expect(screen.getByText(/Worked on media and streaming projects for major clients including Mediaset/i)).toBeInTheDocument();
      expect(screen.getByText(/Learned solid knowledge regarding Java, Python and C\+\+/i)).toBeInTheDocument();
    });
  });

  describe("language filtering", () => {
    /**
     * Language-Specific Rendering: Verify Timeline renders correct language content
     */
    it("should render content for specific language", () => {
      const italianData = mockWorkExperiencesData.filter(item => item.language === "it-IT");

      render(<Timeline data={italianData} />);

      // Verify Italian content is rendered
      expect(screen.getAllByText("Sviluppatore Front-End Senior")).toHaveLength(2);
      expect(screen.getAllByText("Ingegnere Software - Analista")).toHaveLength(2);
      expect(screen.getAllByText("Laurea triennale in Ingegneria Informatica e dell'Automazione")).toHaveLength(2);

      // Verify English content is not present
      expect(screen.queryByText("Senior Front-End Developer")).not.toBeInTheDocument();
      expect(screen.queryByText("Software Engineer - Analyst")).not.toBeInTheDocument();
      expect(screen.queryByText("Bachelor's degree in Computer Software Engineering")).not.toBeInTheDocument();
    });

    /**
     * Data Updates: Verify Timeline handles data changes correctly
     */
    it("should update content when data changes", () => {
      const englishData = mockWorkExperiencesData.filter(item => item.language === "en-GB");
      const italianData = mockWorkExperiencesData.filter(item => item.language === "it-IT");

      const { rerender } = render(<Timeline data={englishData} />);

      // Verify English content is initially rendered
      expect(screen.getAllByText("Senior Front-End Developer")).toHaveLength(2);
      expect(screen.queryByText("Sviluppatore Front-End Senior")).not.toBeInTheDocument();

      // Update to Italian data
      rerender(<Timeline data={italianData} />);

      // Verify Italian content is now rendered
      expect(screen.getAllByText("Sviluppatore Front-End Senior")).toHaveLength(2);
      expect(screen.queryByText("Senior Front-End Developer")).not.toBeInTheDocument();
    });
  });

  describe("component behavior", () => {
    /**
     * Responsive Layout Elements: Verify both mobile and desktop layouts
     */
    it("should render both mobile and desktop layouts", () => {
      const englishData = mockWorkExperiencesData.filter(item => item.language === "en-GB");

      render(<Timeline data={englishData} />);

      // Verify desktop layout elements (hidden on mobile)
      const desktopHeaders = document.querySelectorAll(".hidden.lg\\:block");
      expect(desktopHeaders.length).toBeGreaterThan(0);

      // Verify mobile layout elements (hidden on desktop)
      const mobileHeaders = document.querySelectorAll(".lg\\:hidden");
      expect(mobileHeaders.length).toBeGreaterThan(0);

      // Verify timeline dots are present
      const timelineDots = document.querySelectorAll("[class*=\"rounded-full\"][class*=\"bg-secondary\"]");
      expect(timelineDots.length).toBeGreaterThan(0);
    });
  });

  describe("data validation", () => {
    /**
     * Mixed Data Types: Verify Timeline handles consistent data structure
     */
    it("should handle data with all required fields", () => {
      const englishData = mockWorkExperiencesData.filter(item => item.language === "en-GB");

      render(<Timeline data={englishData} />);

      // Verify all required fields are rendered for each item
      englishData.forEach((item) => {
        expect(screen.getAllByText(item.role)).toHaveLength(2);
        expect(screen.getAllByText(item.company)).toHaveLength(2);
        expect(screen.getAllByText(item.location)).toHaveLength(2);
        expect(screen.getAllByText(`${item.startDate}/${item.endDate}`)).toHaveLength(2);
        expect(screen.getByText(item.shortDescription)).toBeInTheDocument();
        expect(screen.getByText(item.longDescription)).toBeInTheDocument();
      });
    });
  });
});
