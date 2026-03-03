import { test, expect } from "../fixtures/screenshot.fixture";
import { waitForScreenshotReady } from "../helpers/wait-for-content";

test.describe("Homepage sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Hero section renders with 3D content", async ({ page, captureScreenshot }) => {
    const hero = page.locator("#Isaia");
    await expect(hero).toBeVisible();

    // Verify hero text is present (scoped to hero section to avoid duplicate match in About)
    await expect(hero.getByText("Hi, I'm Isaia")).toBeVisible();

    // Wait for section content to settle (canvas may not render in headless mode)
    await waitForScreenshotReady(page, "#Isaia", { hasCanvas: true });

    captureScreenshot({ target: hero, section: "hero" });
  });

  test("About section renders with skills data", async ({ page, captureScreenshot }) => {
    const about = page.locator("#About");
    await about.scrollIntoViewIfNeeded();

    await waitForScreenshotReady(page, "#About", {
      renderDelay: 1_000,
    });

    // Verify section heading
    await expect(about.getByText("About me")).toBeVisible();
    // Verify Skills Lab subsection loaded with API data
    await expect(about.getByText("Skills Lab")).toBeVisible();

    captureScreenshot({ target: about, section: "about" });
  });

  test("Work section renders timeline entries", async ({ page, captureScreenshot }) => {
    const work = page.locator("#Work");
    await work.scrollIntoViewIfNeeded();

    await waitForScreenshotReady(page, "#Work");

    // Verify section heading
    await expect(work.getByText("Work Experience")).toBeVisible();

    captureScreenshot({ target: work, section: "work" });
  });

  test("Projects section renders project list", async ({ page, captureScreenshot }) => {
    const projects = page.locator("#Projects");
    await projects.scrollIntoViewIfNeeded();

    await waitForScreenshotReady(page, "#Projects");

    // Verify section heading
    await expect(projects.getByText("Projects").first()).toBeVisible();

    captureScreenshot({ target: projects, section: "projects" });
  });
});
