export const VIEWPORTS = {
  Desktop: { width: 1280, height: 720 },
  Tablet: { width: 768, height: 1024 },
  Mobile: { width: 375, height: 812 },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;

/**
 * Maps a Playwright project name to its viewport name.
 * Falls back to "Desktop" for unknown projects.
 */
export function getViewportName(projectName: string | undefined): ViewportName {
  if (projectName && projectName in VIEWPORTS) {
    return projectName as ViewportName;
  }
  return "Desktop";
}
