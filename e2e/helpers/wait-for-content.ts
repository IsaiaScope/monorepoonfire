import type { Page } from "@playwright/test";

/**
 * Waits for a section to be visible and any loading spinners to disappear.
 * Works for API-driven sections (Work, Projects) that show skeletons while loading.
 */
export async function waitForSectionData(
  page: Page,
  sectionSelector: string,
): Promise<void> {
  const section = page.locator(sectionSelector);
  await section.waitFor({ state: "visible", timeout: 15_000 });

  // Wait for any skeleton/loading indicators inside the section to disappear
  const skeletons = section.locator("[class*=\"skeleton\"], [class*=\"animate-pulse\"]");
  if (await skeletons.count() > 0) {
    await skeletons.first().waitFor({ state: "hidden", timeout: 15_000 });
  }
}

/**
 * Waits for a <canvas> element to appear and allows time for WebGL rendering.
 * Used for Three.js (Hero alien) and cobe (About globe) sections.
 */
export async function waitForCanvas(
  page: Page,
  containerSelector: string,
  renderDelay = 3_000,
): Promise<void> {
  const canvas = page.locator(`${containerSelector} canvas`);
  await canvas.first().waitFor({ state: "visible", timeout: 15_000 });
  // Allow time for WebGL frame rendering (Three.js/cobe need multiple frames)
  await page.waitForTimeout(renderDelay);
}

/**
 * Finishes all running CSS animations on the page for a stable screenshot.
 */
export async function settleAnimations(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      const effect = animation.effect;
      // Skip infinite animations — they can't be finished
      if (effect && "getComputedTiming" in effect) {
        const timing = effect.getComputedTiming();
        if (timing.duration === Infinity || timing.endTime === Infinity)
          continue;
      }
      try {
        animation.finish();
      }
      catch {
        // Ignore animations that can't be finished (infinite, etc.)
      }
    }
  });
  // Brief pause for repaints
  await page.waitForTimeout(300);
}

/**
 * Combined helper: scrolls to section, waits for data, settles animations.
 * Use this before capturing a screenshot.
 */
export async function waitForScreenshotReady(
  page: Page,
  sectionSelector: string,
  options?: { hasCanvas?: boolean; renderDelay?: number },
): Promise<void> {
  // Scroll section into view
  const section = page.locator(sectionSelector);
  await section.scrollIntoViewIfNeeded();

  // Wait for section content to load
  await waitForSectionData(page, sectionSelector);

  // Wait for canvas rendering if this section has WebGL content
  if (options?.hasCanvas) {
    await waitForCanvas(page, sectionSelector, options.renderDelay);
  }

  // Settle all CSS animations
  await settleAnimations(page);
}
