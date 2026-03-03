import { test, expect } from "../fixtures/screenshot.fixture";

test.describe("Responsive design", () => {
  test("no horizontal overflow on homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const viewportWidth = page.viewportSize()?.width ?? 0;

    // Check that the document doesn't exceed the viewport width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("no horizontal overflow on contact page", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const viewportWidth = page.viewportSize()?.width ?? 0;

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("contact form inputs are usable", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const nameInput = page.locator("#name");
    const emailInput = page.locator("#email");
    const messageInput = page.locator("#message");

    // All form fields should be visible and interactable
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Verify fields are not clipped — their bounding boxes should be within viewport
    const viewportWidth = page.viewportSize()?.width ?? 0;

    for (const input of [nameInput, emailInput, messageInput]) {
      const box = await input.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 1);
      }
    }
  });
});
