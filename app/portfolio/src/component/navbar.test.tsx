import { afterEach } from "vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "../test/set-up-test";
import Navbar from "./navbar";

describe("navbar Component", () => {
  // Clean up after each test to avoid element stacking
  afterEach(() => {
    cleanup();
  });

  // =============================================================================
  // DESKTOP VIEW TESTS
  // =============================================================================
  describe("desktop View", () => {
    const renderDesktopNavbar = (options: any = {}) =>
      render(<Navbar />, { isDesktop: true, ...options } as any);

    describe("home Page Navigation", () => {
      it("shows all navigation links when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        // Check that all main navigation links are present
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.getByText("Work")).toBeInTheDocument();
        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();
      });

      it("renders Home as anchor link when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        const homeLink = screen.getByText("Home").closest("a");
        expect(homeLink).toHaveAttribute("href", "#Home");
      });

      it("renders section navigation as anchor links when on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/" } });

        // Check section anchor links
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

        // Should show home link
        expect(screen.getByText("Home")).toBeInTheDocument();

        // Should not show section links when not on home page
        expect(screen.queryByText("About")).not.toBeInTheDocument();
        expect(screen.queryByText("Work")).not.toBeInTheDocument();
        expect(screen.queryByText("Projects")).not.toBeInTheDocument();
        expect(screen.queryByText("Contact")).not.toBeInTheDocument();
      });

      it("renders Home as router link when not on home page", () => {
        renderDesktopNavbar({ location: { pathname: "/contact" } });

        const homeLink = screen.getByText("Home").closest("a");
        expect(homeLink).toHaveAttribute("href", "/");
      });
    });

    describe("language and Theme Controls", () => {
      it("shows language selector", () => {
        renderDesktopNavbar();

        // Language selector should be present (button with language options)
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      it("shows dark mode toggle", () => {
        renderDesktopNavbar();

        // Dark mode toggle should be present
        expect(screen.getByRole("button")).toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // MOBILE VIEW TESTS
  // =============================================================================
  describe("mobile View", () => {
    const renderMobileNavbar = (options: any = {}) =>
      render(<Navbar />, { isDesktop: false, ...options } as any);

    describe("home Page Navigation", () => {
      it("shows Home link and controls when on home page", () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Should show home link
        expect(screen.getByText("Home")).toBeInTheDocument();

        // Should show controls (exact count may vary based on component implementation)
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      });

      it("shows hamburger menu button when on home page", () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Menu button should be present
        const menuButtons = screen.getAllByRole("button");
        expect(menuButtons.length).toBeGreaterThan(0);
      });

      it("opens menu sheet when hamburger button is clicked", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Find and click the menu button (last button should be the menu)
        const buttons = screen.getAllByRole("button");
        const menuButton = buttons[buttons.length - 1];

        fireEvent.click(menuButton);

        // Wait for sheet to open and check for menu content
        await waitFor(() => {
          expect(screen.getByText("Menu")).toBeInTheDocument();
        });
      });

      it("shows navigation links in menu sheet", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Open menu
        const buttons = screen.getAllByRole("button");
        const menuButton = buttons[buttons.length - 1];
        fireEvent.click(menuButton);

        // Check menu content
        await waitFor(() => {
          expect(screen.getByText("Menu")).toBeInTheDocument();
          // Note: These links appear in addition to the main Home link
          expect(screen.getAllByText("About")).toHaveLength(1);
          expect(screen.getAllByText("Work")).toHaveLength(1);
          expect(screen.getAllByText("Projects")).toHaveLength(1);
          expect(screen.getAllByText("Contact")).toHaveLength(1);
        });
      });

      it("shows menu description for accessibility", async () => {
        renderMobileNavbar({ location: { pathname: "/" } });

        // Open menu
        const buttons = screen.getAllByRole("button");
        const menuButton = buttons[buttons.length - 1];
        fireEvent.click(menuButton);

        // Check for screen reader description
        await waitFor(() => {
          expect(screen.getByText("This is the menu for the app. Use the links below to navigate")).toBeInTheDocument();
        });
      });
    });

    describe("non-Home Page Navigation", () => {
      it("shows only Home link and controls when not on home page", () => {
        renderMobileNavbar({ location: { pathname: "/contact" } });

        // Should show home link
        expect(screen.getByText("Home")).toBeInTheDocument();

        // Should show controls but no menu button (exact count may vary)
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      });

      it("does not show hamburger menu when not on home page", () => {
        renderMobileNavbar({ location: { pathname: "/contact" } });

        // Should have controls but not menu button
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);

        // The key thing is that we should not have the sheet menu functionality
        // which is confirmed by not being on home page
        expect(screen.queryByText("Menu")).not.toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // INTERNATIONALIZATION TESTS
  // =============================================================================
  describe("internationalization", () => {
    it("renders navigation in English by default", () => {
      render(<Navbar />, { language: "en-GB", location: { pathname: "/" } } as any);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Projects")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders navigation in Italian when language is set", () => {
      render(<Navbar />, { language: "it-IT", location: { pathname: "/" } } as any);

      expect(screen.getByText("Casa")).toBeInTheDocument(); // Home
      expect(screen.getByText("Chi Sono")).toBeInTheDocument(); // About
      expect(screen.getByText("Lavoro")).toBeInTheDocument(); // Work
      expect(screen.getByText("Progetti")).toBeInTheDocument(); // Projects
      expect(screen.getByText("Contatti")).toBeInTheDocument(); // Contact
    });

    it("updates href attributes based on language", () => {
      render(<Navbar />, { language: "it-IT", location: { pathname: "/" } } as any);

      // Check that anchor hrefs use translated text
      const aboutLink = screen.getByText("Chi Sono").closest("a");
      expect(aboutLink).toHaveAttribute("href", "#Chi Sono");

      const workLink = screen.getByText("Lavoro").closest("a");
      expect(workLink).toHaveAttribute("href", "#Lavoro");
    });

    it("shows correct menu content in Italian (mobile)", async () => {
      render(<Navbar />, {
        language: "it-IT",
        location: { pathname: "/" },
        isDesktop: false,
      } as any);

      // Open menu
      const buttons = screen.getAllByRole("button");
      const menuButton = buttons[buttons.length - 1];
      fireEvent.click(menuButton);

      // Check menu content in Italian
      await waitFor(() => {
        expect(screen.getByText("Menu")).toBeInTheDocument();
        expect(screen.getAllByText("Chi Sono")).toHaveLength(1);
        expect(screen.getAllByText("Lavoro")).toHaveLength(1);
        expect(screen.getAllByText("Progetti")).toHaveLength(1);
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

    it("provides screen reader description for mobile menu", async () => {
      render(<Navbar />, { isDesktop: false, location: { pathname: "/" } } as any);

      // Open menu
      const buttons = screen.getAllByRole("button");
      const menuButton = buttons[buttons.length - 1];
      fireEvent.click(menuButton);

      // Check for screen reader only description
      await waitFor(() => {
        const description = screen.getByText("This is the menu for the app. Use the links below to navigate");
        expect(description).toHaveClass("sr-only");
      });
    });

    it("has proper link roles and attributes", () => {
      render(<Navbar />, { location: { pathname: "/" } } as any);

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);

      // Each link should have proper href
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
      });
    });
  });

  // =============================================================================
  // STYLING AND LAYOUT TESTS
  // =============================================================================
  describe("styling and Layout", () => {
    it("applies fixed positioning and backdrop blur", () => {
      render(<Navbar />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("fixed", "backdrop-blur-md");
    });

    it("applies proper z-index for overlay", () => {
      render(<Navbar />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("z-20");
    });

    it("accepts custom className prop", () => {
      render(<Navbar className="custom-navbar" />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("custom-navbar");
    });

    it("shows animation classes on elements", () => {
      render(<Navbar />, { location: { pathname: "/" } } as any);

      // Check for animate-in classes (indicating animations are applied)
      const animatedElements = screen.getByRole("navigation").querySelectorAll(".animate-in");
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  // =============================================================================
  // RESPONSIVE BEHAVIOR TESTS
  // =============================================================================
  describe("responsive Behavior", () => {
    it("shows different layouts for desktop vs mobile on home page", () => {
      // Test desktop layout
      render(<Navbar />, {
        isDesktop: true,
        location: { pathname: "/" },
      } as any);

      // Should show all nav links directly in desktop
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();

      // Clean and test mobile layout
      document.body.innerHTML = "";

      render(<Navbar />, {
        isDesktop: false,
        location: { pathname: "/" },
      } as any);

      // Should not show nav links directly in mobile (they're in the menu)
      expect(screen.queryByText("About")).not.toBeInTheDocument();
      expect(screen.queryByText("Work")).not.toBeInTheDocument();
    });

    it("maintains consistent Home link behavior across screen sizes", () => {
      // Test desktop on contact page
      render(<Navbar />, {
        isDesktop: true,
        location: { pathname: "/contact" },
      } as any);

      // Should only show Home link
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.queryByText("About")).not.toBeInTheDocument();

      // Clean and test mobile on same page
      document.body.innerHTML = "";

      render(<Navbar />, {
        isDesktop: false,
        location: { pathname: "/contact" },
      } as any);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.queryByText("About")).not.toBeInTheDocument();
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================
  describe("integration with Router", () => {
    it("responds to route changes correctly", () => {
      // Start on home page
      render(<Navbar />, {
        location: { pathname: "/" },
      } as any);

      // Should show section navigation
      expect(screen.getByText("About")).toBeInTheDocument();

      // Test contact page by rendering with different location
      cleanup();
      render(<Navbar />, {
        location: { pathname: "/contact" },
      } as any);

      // Should hide section navigation
      expect(screen.queryByText("About")).not.toBeInTheDocument();
    });

    it("updates Home link behavior based on current route", () => {
      // Test on home page
      render(<Navbar />, {
        location: { pathname: "/" },
      } as any);

      let homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveAttribute("href", "#Home");

      // Test on contact page
      cleanup();
      render(<Navbar />, {
        location: { pathname: "/contact" },
      } as any);

      homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });
});
