import path from "node:path";

const SCREENSHOTS_DIR = path.resolve(__dirname, "../../doc/screenshots");

/**
 * Builds the absolute path for a screenshot file.
 * Output: doc/screenshots/{section}/{viewport}.png
 */
export function screenshotPath(section: string, viewport: string): string {
  return path.join(SCREENSHOTS_DIR, section, `${viewport.toLowerCase()}.png`);
}
