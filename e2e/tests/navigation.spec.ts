import { test, expect } from "../fixtures/screenshot.fixture";
import { settleAnimations } from "../helpers/wait-for-content";

test.describe("Navigation", () => {
  test("navbar renders with section links", async ({ page, captureScreenshot }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await settleAnimations(page);

    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Check that the home link is visible in navbar
    const nav = header.locator("nav");
    await expect(nav).toBeVisible();

    captureScreenshot({ target: header, section: "navbar", captureMode: "element" });
  });

  test("desktop navbar shows section links", async ({ page }) => {
    // This test only makes sense at desktop viewport (lg breakpoint: 1024px+)
    const viewportSize = page.viewportSize();
    if (!viewportSize || viewportSize.width < 1024) {
      test.skip();
      return;
    }

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("header nav");
    await expect(nav.getByText("About")).toBeVisible();
    await expect(nav.getByText("Work")).toBeVisible();
    await expect(nav.getByText("Projects")).toBeVisible();
    await expect(nav.getByText("Contact")).toBeVisible();
  });

  test("mobile menu opens and contains links", async ({ page }) => {
    const viewportSize = page.viewportSize();
    // Only run on viewports below lg breakpoint
    if (!viewportSize || viewportSize.width >= 1024) {
      test.skip();
      return;
    }

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open the mobile menu sheet
    const menuButton = page.getByRole("button", { name: "Navigation Menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Verify sheet content has navigation links
    const sheet = page.locator("[data-state='open']");
    await expect(sheet.getByText("About")).toBeVisible();
    await expect(sheet.getByText("Work")).toBeVisible();
    await expect(sheet.getByText("Projects")).toBeVisible();
    await expect(sheet.getByText("Contact")).toBeVisible();
  });

  test("contact link navigates to /contact", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width >= 1024) {
      // Desktop: click Contact in navbar
      await page.locator("header nav").getByText("Contact").click();
    } else {
      // Mobile: open menu then click Contact
      await page.getByRole("button", { name: "Navigation Menu" }).click();
      const sheet = page.locator("[data-state='open']");
      await sheet.getByText("Contact").click();
    }

    await page.waitForURL("/contact");
    await expect(page.locator("#name")).toBeVisible();
  });

  test("footer renders with social links", async ({ page, captureScreenshot }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const footer = page.locator("footer").filter({ hasText: "Terms & Conditions" });
    await footer.scrollIntoViewIfNeeded();
    await settleAnimations(page);

    await expect(footer).toBeVisible();
    // Verify at least one social link is present
    await expect(footer.getByLabel("GitHub")).toBeVisible();

    captureScreenshot({ target: footer, section: "footer", captureMode: "element" });
  });
});
