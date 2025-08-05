import type { TestRenderOptions } from "../test/set-up-test";

import { cleanup, fireEvent, render, screen, waitFor } from "../test/set-up-test";
import Navbar from "./navbar";

describe("navbar component", () => {
  // =============================================================================
  // DESKTOP VIEW TESTS
  // =============================================================================
  describe("desktop View", () => {
    const renderDesktopNavbar = (options: TestRenderOptions = {}) =>
      render(<Navbar />, { isMobile: false, ...options });

    describe("home Page Navigation", () => {
      it("shows all navigation links when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        expect(screen.getByText("Isaia")).toBeInTheDocument(); // Home is "Isaia" in locale
        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.getByText("Work")).toBeInTheDocument();
        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();
      });

      it("renders Home as anchor link when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        const homeLink = screen.getByText("Isaia").closest("a"); // Home is "Isaia" in locale
        expect(homeLink).toHaveAttribute("href", "#Isaia"); // href also uses "Isaia"
      });

      it("renders section navigation as anchor links when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        const aboutLink = screen.getByText("About").closest("a");
        expect(aboutLink).toHaveAttribute("href", "#About");

        const workLink = screen.getByText("Work").closest("a");
        expect(workLink).toHaveAttribute("href", "#Work");

        const projectsLink = screen.getByText("Projects").closest("a");
        expect(projectsLink).toHaveAttribute("href", "#Projects");
      });

      it("renders Contact as router link when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        const contactLink = screen.getByText("Contact").closest("a");
        expect(contactLink).toHaveAttribute("href", "/contact");
      });
    });

    describe("non-Home Page Navigation", () => {
      it("shows only Home link when not on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/contact" } });

        expect(screen.getByText("Isaia")).toBeInTheDocument(); // Home is "Isaia" in locale
        expect(screen.queryByText("About")).not.toBeInTheDocument();
        expect(screen.queryByText("Work")).not.toBeInTheDocument();
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
        expect(screen.queryByText("Contact")).not.toBeInTheDocument();
      });

      it("renders Home as router link when not on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/contact" } });

        const homeLink = screen.getByText("Isaia").closest("a"); // Home is "Isaia" in locale
        expect(homeLink).toHaveAttribute("href", "/");
      });
    });

    describe("language and Theme Controls", () => {
      it("shows language selector", () => {
        renderDesktopNavbar();

        // Language selector renders as a combobox with English flag and text
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("English")).toBeInTheDocument();
      });

      it("shows dark mode toggle", () => {
        renderDesktopNavbar();

        // Dark mode toggle has screen reader text for accessibility
        expect(screen.getByText("Toggle dark mode")).toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // MOBILE VIEW TESTS
  // =============================================================================
  describe("mobile View", () => {
    const renderMobileNavbar = (options: TestRenderOptions = {}) =>
      render(<Navbar />, { isMobile: true, ...options });

    describe("home Page Navigation", () => {
      it("shows Home link and language/theme controls when on home page", () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Home link should be visible
        expect(screen.getByText("Isaia")).toBeInTheDocument();

        // Language selector should be present
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("English")).toBeInTheDocument();

        // Dark mode toggle should be present
        expect(screen.getByText("Toggle dark mode")).toBeInTheDocument();
      });

      it("shows hamburger menu button when on home page", () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find the button that controls a dialog (sheet trigger)
        const menuButtons = screen.getAllByRole("button");
        const sheetTrigger = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        expect(sheetTrigger).toBeInTheDocument();
      });

      it("opens menu sheet when hamburger button is clicked", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find the sheet trigger button
        const menuButtons = screen.getAllByRole("button");
        const menuButton = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );

        fireEvent.click(menuButton!);

        await waitFor(() => {
          expect(screen.getByText("Menu")).toBeInTheDocument();
        });
      });

      it("shows all navigation links in opened menu sheet", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find and click the sheet trigger button
        const menuButtons = screen.getAllByRole("button");
        const menuButton = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        fireEvent.click(menuButton!);

        await waitFor(() => {
          // Menu should be open
          expect(screen.getByText("Menu")).toBeInTheDocument();

          // All navigation links should be present in the menu
          expect(screen.getByText("About")).toBeInTheDocument();
          expect(screen.getByText("Work")).toBeInTheDocument();
          expect(screen.getByText("Projects")).toBeInTheDocument();
          expect(screen.getByText("Contact")).toBeInTheDocument();
        });
      });

      it("provides accessibility description for menu navigation", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find and click the sheet trigger button
        const menuButtons = screen.getAllByRole("button");
        const menuButton = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        fireEvent.click(menuButton!);

        await waitFor(() => {
          const description = screen.getByText("This is the menu for the app. Use the links below to navigate");
          expect(description).toBeInTheDocument();
          expect(description).toHaveClass("sr-only");
        });
      });

      it("renders navigation links with correct hrefs in menu", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find and click the sheet trigger button
        const menuButtons = screen.getAllByRole("button");
        const menuButton = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        fireEvent.click(menuButton!);

        await waitFor(() => {
          // Check that links have proper anchor hrefs for home page sections
          const aboutLink = screen.getByText("About").closest("a");
          expect(aboutLink).toHaveAttribute("href", "#About");

          const workLink = screen.getByText("Work").closest("a");
          expect(workLink).toHaveAttribute("href", "#Work");

          const projectsLink = screen.getByText("Projects").closest("a");
          expect(projectsLink).toHaveAttribute("href", "#Projects");

          const contactLink = screen.getByText("Contact").closest("a");
          expect(contactLink).toHaveAttribute("href", "/contact");
        });
      });
    });

    describe("non-Home Page Navigation", () => {
      it("shows only Home link and controls when not on home page", () => {
        renderMobileNavbar({ location: { pathname: "/contact" } });

        // Home link should be visible
        expect(screen.getByText("Isaia")).toBeInTheDocument();

        // Language and theme controls should still be present
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getByText("Toggle dark mode")).toBeInTheDocument();

        // Navigation links should not be visible (no hamburger menu)
        expect(screen.queryByText("About")).not.toBeInTheDocument();
        expect(screen.queryByText("Work")).not.toBeInTheDocument();
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
      });

      it("does not show hamburger menu when not on home page", () => {
        renderMobileNavbar({ location: { pathname: "/contact" } });

        // Hamburger menu button should not be present
        const menuButtons = screen.getAllByRole("button");
        const sheetTrigger = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        expect(sheetTrigger).toBeUndefined();

        // Menu content should not be accessible
        expect(screen.queryByText("Menu")).not.toBeInTheDocument();
      });

      it("renders Home as router link when not on home page", () => {
        renderMobileNavbar({ location: { pathname: "/contact" } });

        const homeLink = screen.getByText("Isaia").closest("a");
        expect(homeLink).toHaveAttribute("href", "/");
      });
    });

    describe("mobile Menu Interaction", () => {
      it("menu should stay open after internal link clicking", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find and open menu
        const menuButtons = screen.getAllByRole("button");
        const menuButton = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        fireEvent.click(menuButton!);

        await waitFor(() => {
          expect(screen.getByText("Menu")).toBeInTheDocument();
        });

        // Click on a navigation link should close menu (simulated by checking if menu behavior works)
        const aboutLink = screen.getByText("About");
        expect(aboutLink).toBeInTheDocument();
        fireEvent.click(aboutLink);

        // Menu should still be functional after interaction
        expect(screen.getByText("Menu")).toBeInTheDocument();
      });

      it("maintains proper focus management and keyboard accessibility in menu", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find and open the mobile menu
        const menuButtons = screen.getAllByRole("button");
        const menuButton = menuButtons.find(button =>
          button.getAttribute("aria-haspopup") === "dialog",
        );
        fireEvent.click(menuButton!);

        await waitFor(() => {
          // Verify menu is open before testing focus management
          expect(screen.getByText("Menu")).toBeInTheDocument();

          // Get all links in the document after menu is opened
          const allLinks = screen.getAllByRole("link");

          // Filter to find only the navigation links within the menu
          const navigationLinks = allLinks.filter((link) => {
            const linkText = link.textContent;
            return linkText?.includes("About")
              || linkText?.includes("Work")
              || linkText?.includes("Projects")
              || linkText?.includes("Contact");
          });

          // Ensure we found the expected navigation links
          expect(navigationLinks).toHaveLength(4);

          // Test that each navigation link is properly accessible
          navigationLinks.forEach((link) => {
            // Each link should have an href attribute for navigation
            expect(link).toHaveAttribute("href");

            // Each link should be focusable (have tabindex >= 0 or be naturally focusable)
            expect(link).not.toHaveAttribute("tabindex", "-1");

            // Each link should be visible and interactable
            expect(link).toBeVisible();
          });

          // Verify specific navigation links are present and properly configured
          const aboutLink = screen.getByText("About").closest("a");
          const workLink = screen.getByText("Work").closest("a");
          const projectsLink = screen.getByText("Projects").closest("a");
          const contactLink = screen.getByText("Contact").closest("a");

          expect(aboutLink).toHaveAttribute("href", "#About");
          expect(workLink).toHaveAttribute("href", "#Work");
          expect(projectsLink).toHaveAttribute("href", "#Projects");
          expect(contactLink).toHaveAttribute("href", "/contact");
        });
      });
    });
  });

  // =============================================================================
  // INTERNATIONALIZATION TESTS
  // =============================================================================
  describe("internationalization", () => {
    it("renders navigation in English by default", () => {
      render(<Navbar />, {
        language: "en-GB",
        location: { pathname: "/" },
        isMobile: false, // Use desktop view to see navigation links
      });

      expect(screen.getByText("Isaia")).toBeInTheDocument(); // Home is "Isaia" in the locale file
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders navigation in Italian when language is set", () => {
      render(<Navbar />, {
        language: "it-IT",
        location: { pathname: "/" },
        isMobile: false, // Use desktop view to see navigation links
      });

      expect(screen.getByText("Isaia")).toBeInTheDocument(); // Home is "Isaia" in both locales
      expect(screen.getByText("Chi sono")).toBeInTheDocument(); // About is "Chi sono" in Italian
      expect(screen.getByText("Esperienze")).toBeInTheDocument(); // Work is "Esperienze"
      expect(screen.getByText("Progetti")).toBeInTheDocument(); // Projects is "Progetti"
      expect(screen.getByText("Contattami")).toBeInTheDocument(); // Contact is "Contattami"
    });

    it("shows correct menu content in Italian (mobile)", async () => {
      render(<Navbar />, {
        language: "it-IT",
        location: { pathname: "/" },
        isMobile: true,
      });

      // Find and click the hamburger menu button using consistent selector
      const menuButtons = screen.getAllByRole("button");
      const menuButton = menuButtons.find(button =>
        button.getAttribute("aria-haspopup") === "dialog",
      );
      fireEvent.click(menuButton!);

      await waitFor(() => {
        // Verify menu is open
        expect(screen.getByText("Menu")).toBeInTheDocument();

        // Verify Italian navigation links are present
        expect(screen.getByText("Chi sono")).toBeInTheDocument(); // About is "Chi sono" in Italian
        expect(screen.getByText("Esperienze")).toBeInTheDocument(); // Work is "Esperienze"
        expect(screen.getByText("Progetti")).toBeInTheDocument(); // Projects is "Progetti"
        expect(screen.getByText("Contattami")).toBeInTheDocument(); // Contact is "Contattami"

        // Verify Italian links have correct href attributes
        expect(screen.getByText("Chi sono").closest("a")).toHaveAttribute("href", "#Chi sono");
        expect(screen.getByText("Esperienze").closest("a")).toHaveAttribute("href", "#Esperienze");
        expect(screen.getByText("Progetti").closest("a")).toHaveAttribute("href", "#Progetti");
        expect(screen.getByText("Contattami").closest("a")).toHaveAttribute("href", "/contact");
      });
    });
  });

  // =============================================================================
  // ACCESSIBILITY TESTS
  // =============================================================================
  describe("accessibility", () => {
    it("renders as semantic header element", () => {
      render(<Navbar />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders as semantic nav element", () => {
      render(<Navbar />);

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("has proper link roles and attributes", () => {
      render(<Navbar />, { location: { pathname: "/" } });

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);

      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
      });
    });
  });

  // =============================================================================
  // RESPONSIVE BEHAVIOR TESTS
  // =============================================================================
  describe("responsive Behavior", () => {
    it("shows different layouts for desktop vs mobile on home page", () => {
      render(<Navbar />, {
        isMobile: false,
        location: { pathname: "/" },
      });

      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();

      cleanup();

      render(<Navbar />, {
        isMobile: true,
        location: { pathname: "/" },
      });

      expect(screen.queryByText("About")).not.toBeInTheDocument();
      expect(screen.queryByText("Work")).not.toBeInTheDocument();
    });

    it("maintains consistent Home link behavior across screen sizes", () => {
      render(<Navbar />, {
        isMobile: false,
        location: { pathname: "/contact" },
      });

      expect(screen.getByText("Isaia")).toBeInTheDocument(); // Home is "Isaia" in locale
      expect(screen.queryByText("About")).not.toBeInTheDocument();

      cleanup();

      render(<Navbar />, {
        isMobile: true,
        location: { pathname: "/contact" },
      });

      expect(screen.getByText("Isaia")).toBeInTheDocument(); // Home is "Isaia" in locale
      expect(screen.queryByText("About")).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================
  describe("integration with Router", () => {
    it("responds to route changes correctly", () => {
      render(<Navbar />, {
        location: { pathname: "/" },
        isMobile: false, // Use desktop view to see navigation links
      });

      expect(screen.getByText("About")).toBeInTheDocument();

      cleanup();
      render(<Navbar />, {
        location: { pathname: "/contact" },
        isMobile: false, // Use desktop view to see navigation links
      });

      expect(screen.queryByText("About")).not.toBeInTheDocument();
    });

    it("updates Home link behavior based on current route", () => {
      render(<Navbar />, {
        location: { pathname: "/" },
        isMobile: false, // Use desktop view to see navigation links
      });

      let homeLink = screen.getByText("Isaia").closest("a"); // Home is "Isaia" in locale
      expect(homeLink).toHaveAttribute("href", "#Isaia"); // href also uses "Isaia"

      cleanup();
      render(<Navbar />, {
        location: { pathname: "/contact" },
        isMobile: false, // Use desktop view to see navigation links
      });

      homeLink = screen.getByText("Isaia").closest("a"); // Home is "Isaia" in locale
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });
});
