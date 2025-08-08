/**
 * Create Section ID Utility
 *
 * Converts translated section names into valid HTML ID attributes and anchor links.
 * HTML IDs cannot contain spaces, so this utility handles the conversion properly
 * to ensure anchor links work correctly across all languages.
 *
 * Example:
 * - "About" → "About" (no change needed)
 * - "Chi sono" → "Chi-sono" (Italian "About" with spaces replaced)
 * - "Work Experience" → "Work-Experience" (hypothetical multi-word section)
 */

/**
 * Converts a section name to a valid HTML ID
 *
 * @param sectionName - The section name (can be translated text with spaces)
 * @returns A valid HTML ID string with spaces replaced by hyphens
 *
 * @example
 * createSectionId("Chi sono") // Returns "Chi-sono"
 * createSectionId("About") // Returns "About"
 * createSectionId("Work Experience") // Returns "Work-Experience"
 */
export function createSectionId(sectionName: string): string {
  return sectionName
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace one or more spaces with a single hyphen
    .replace(/[^\w\-]/g, "") // Remove any characters that aren't word characters or hyphens
    .replace(/-{2,}/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Creates an anchor link href for a section
 *
 * @param sectionName - The section name (can be translated text with spaces)
 * @returns A valid anchor link href with the # prefix
 *
 * @example
 * createSectionHref("Chi sono") // Returns "#Chi-sono"
 * createSectionHref("About") // Returns "#About"
 */
export function createSectionHref(sectionName: string): string {
  return `#${createSectionId(sectionName)}`;
}
