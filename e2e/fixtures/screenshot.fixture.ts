import { mkdirSync } from "node:fs";
import path from "node:path";

import { test as base } from "@playwright/test";

import { screenshotPath } from "../helpers/screenshot-paths";
import { getViewportName } from "../helpers/viewports";

import type { Locator, Page } from "@playwright/test";

/** Injects CSS to hide devtools and pause all animations for clean screenshots. */
async function preparePageForScreenshot(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (document.getElementById("e2e-screenshot-cleanup")) return;
    const style = document.createElement("style");
    style.id = "e2e-screenshot-cleanup";
    style.textContent = `
      /* Hide TanStack devtools panels */
      .tsqd-parent-container,
      .TanStackRouterDevtools,
      [class*="ReactQueryDevtools"],
      [class*="TanStackRouterDevtools"] {
        display: none !important;
      }
      /* Pause animations at current frame instead of canceling them */
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });
  await page.waitForTimeout(100);
}

type ScreenshotRequest = {
  /** What to screenshot — page for full page, or a locator for a section */
  target: Page | Locator;
  /** Section name used in the output path (e.g., "hero", "about") */
  section: string;
  /** Whether to capture the full page or just the viewport */
  fullPage?: boolean;
  /** "viewport" scrolls target into view and captures the viewport (shows navbar). "element" captures just the target's bounding box. */
  captureMode?: "viewport" | "element";
};

type ScreenshotFixture = {
  /** Queues a screenshot to be captured after the test passes */
  captureScreenshot: (request: ScreenshotRequest) => void;
};

/**
 * Extended Playwright test with screenshot capture fixture.
 *
 * Screenshots are queued during the test and only written to disk
 * if the test passes. This ensures documentation screenshots always
 * reflect working features.
 */
export const test = base.extend<ScreenshotFixture>({
  captureScreenshot: async ({ page }, use, testInfo) => {
    const queue: ScreenshotRequest[] = [];

    // Provide the queueing function to tests
    await use((request: ScreenshotRequest) => {
      queue.push(request);
    });

    // After test completes — only capture if it passed
    if (testInfo.status === "passed" && queue.length > 0) {
      const viewport = getViewportName(testInfo.project.name);
      await preparePageForScreenshot(page);

      for (const { target, section, fullPage, captureMode = "viewport" } of queue) {
        const outputPath = screenshotPath(section, viewport);
        mkdirSync(path.dirname(outputPath), { recursive: true });

        if (captureMode === "element") {
          await target.screenshot({ path: outputPath, fullPage: fullPage ?? false });
        } else {
          // Scroll target into view — scrollIntoView respects scroll-margin-top (navbar offset)
          await (target as Locator).evaluate((el) => {
            el.scrollIntoView({ block: "start", behavior: "instant" });
          });
          await page.waitForTimeout(300);
          await page.screenshot({ path: outputPath, fullPage: false });
        }
      }
    }
  },
});

export { expect } from "@playwright/test";
