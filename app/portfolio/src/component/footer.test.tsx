import type { TestRenderOptions } from "../test/set-up-test";

import { cleanup, render, screen } from "../test/set-up-test";
import Footer from "./footer";

describe("footer Component", () => {
  const renderFooter = (options: TestRenderOptions = {}) =>
    render(<Footer />, options);

  // =============================================================================
  // BASIC STRUCTURE TESTS
  // =============================================================================
  describe("basic Structure", () => {
    it("renders as semantic footer element", () => {
      renderFooter();

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("always renders copyright and terms text in DOM for all viewports", () => {
      renderFooter();

      // These texts are always present in DOM regardless of viewport
      const copyrightText = screen.getByText(/© 2025 Isaia. All rights reserved./);
      const termsText = screen.getByText(/Terms & Conditions \| Privacy Policy/);

      expect(copyrightText).toBeInTheDocument();
      expect(termsText).toBeInTheDocument();
    });
  });

  // =============================================================================
  // SOCIAL MEDIA LINKS TESTS
  // =============================================================================
  describe("social Media Links", () => {
    it("renders all social media platforms with correct URLs", () => {
      renderFooter();

      // Test each platform individually with explicit expectations
      expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/IsaiaScope");
      expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/isaia-riva/");
      expect(screen.getByRole("link", { name: "Twitch" })).toHaveAttribute("href", "https://www.twitch.tv/iso_on_fire");
      expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://www.instagram.com/iso_on_fire");
      expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", "https://www.facebook.com/isaia.riva/");
      expect(screen.getByRole("link", { name: "Twitter" })).toHaveAttribute("href", "https://x.com/isaia77462");
    });

    it("provides proper accessibility labels", () => {
      renderFooter();

      // Each link has proper aria-label for screen readers
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitch")).toBeInTheDocument();
      expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
      expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    });

    it("opens all social links in new tabs securely", () => {
      renderFooter();

      const expectedPlatforms = ["GitHub", "LinkedIn", "Twitch", "Instagram", "Facebook", "Twitter"];

      expectedPlatforms.forEach((platform) => {
        const link = screen.getByRole("link", { name: platform });
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("renders as link elements without button wrappers", () => {
      renderFooter();

      // Social links are direct <a> elements, not wrapped in buttons
      const allLinks = screen.getAllByRole("link");
      const socialLinks = allLinks.filter(link =>
        link.getAttribute("href")?.startsWith("http"),
      );

      expect(socialLinks.length).toBe(6); // Exactly 6 social media platforms
    });
  });

  // =============================================================================
  // INTERNATIONALIZATION TESTS
  // =============================================================================
  describe("internationalization", () => {
    it("displays content in English by default", () => {
      renderFooter({ language: "en-GB" });

      expect(screen.getByText(/Terms & Conditions \| Privacy Policy/)).toBeInTheDocument();
      expect(screen.getByText(/2025 Isaia. All rights reserved./)).toBeInTheDocument();

      // Social platform names remain the same across languages
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitch")).toBeInTheDocument();
      expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
      expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    });

    it("displays content in Italian when language is changed", () => {
      renderFooter({ language: "it-IT" });

      expect(screen.getByText(/Termini e Condizioni \| Politica sulla Privacy/)).toBeInTheDocument();
      expect(screen.getByText(/2025 Isaia. Tutti i diritti riservati./)).toBeInTheDocument();

      // Social platform aria-labels remain in English (international brands)
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitch")).toBeInTheDocument();
      expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
      expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // ACCESSIBILITY TESTS
  // =============================================================================
  describe("accessibility", () => {
    it("provides semantic footer landmark", () => {
      renderFooter();

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("ensures all links are keyboard accessible", () => {
      renderFooter();

      const allLinks = screen.getAllByRole("link");

      allLinks.forEach((link) => {
        // Links should be focusable (no negative tabindex)
        expect(link).not.toHaveAttribute("tabindex", "-1");
        // All links should have href attribute
        expect(link).toHaveAttribute("href");
      });
    });

    it("provides proper labels for screen readers", () => {
      renderFooter();

      const socialLinks = screen.getAllByRole("link").filter(link =>
        link.getAttribute("href")?.startsWith("http"),
      );

      socialLinks.forEach((link) => {
        // Each social link should have descriptive aria-label
        const ariaLabel = link.getAttribute("aria-label");
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel!.length).toBeGreaterThan(0);
      });
    });
  });

  // =============================================================================
  // ROUTER INTEGRATION TESTS
  // =============================================================================
  describe("router Integration", () => {
    it("renders consistently across different routes", () => {
      // Test multiple routes to ensure footer behavior is consistent
      const routes = ["/", "/contact"];

      routes.forEach((path) => {
        cleanup(); // Clean up before each render
        const { container } = render(<Footer />, { location: { pathname: path } });
        const footer = container.querySelector("footer");

        // Footer should always be present regardless of route
        expect(footer).toBeInTheDocument();

        // Should always have the same content structure
        expect(screen.getByText(/Terms & Conditions \| Privacy Policy/)).toBeInTheDocument();
        expect(screen.getByText(/© 2025 Isaia. All rights reserved./)).toBeInTheDocument();

        // Should always have 6 social links
        const socialLinks = screen.getAllByRole("link").filter(link =>
          link.getAttribute("href")?.startsWith("http"),
        );
        expect(socialLinks).toHaveLength(6);
      });
    });
  });
});
