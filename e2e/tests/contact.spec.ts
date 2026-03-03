import { test, expect } from "../fixtures/screenshot.fixture";
import { settleAnimations } from "../helpers/wait-for-content";

test.describe("Contact page", () => {
  test("renders contact form with all fields", async ({ page, captureScreenshot }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    // Verify form elements are present
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();

    // Verify the submit button
    await expect(page.getByText("Send Email")).toBeVisible();

    await settleAnimations(page);

    captureScreenshot({ target: page.locator("section").filter({ has: page.locator("#name") }), section: "contact" });
  });
});
