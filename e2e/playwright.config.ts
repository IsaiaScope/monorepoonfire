import { defineConfig, devices } from "@playwright/test";

import { VIEWPORTS } from "./helpers/viewports";

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/._*"],
  outputDir: "./test-results",
  reporter: [["html", { outputFolder: "./playwright-report" }]],

  /* Single worker for deterministic screenshot order */
  fullyParallel: false,
  workers: 1,

  /* 60s per test — 3D rendering needs time in CI */
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: "http://localhost:3075",
    locale: "en-GB",
    screenshot: "off",
    trace: "on-first-retry",
    launchOptions: {
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--ignore-gpu-blocklist",
      ],
    },
  },

  projects: [
    {
      name: "Desktop",
      use: {
        viewport: VIEWPORTS.Desktop,
        ...devices["Desktop Chrome"],
        /* Override device viewport with our exact dimensions */
        ...{ viewport: VIEWPORTS.Desktop },
      },
    },
    {
      name: "Tablet",
      use: {
        viewport: VIEWPORTS.Tablet,
        ...devices["Desktop Chrome"],
        ...{ viewport: VIEWPORTS.Tablet },
      },
    },
    {
      name: "Mobile",
      use: {
        viewport: VIEWPORTS.Mobile,
        ...devices["Pixel 7"],
        ...{ viewport: VIEWPORTS.Mobile },
      },
    },
  ],

  /* Start the Hono backend which serves the built portfolio */
  webServer: {
    command: "pnpm --filter @app/hono start",
    port: 3075,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
