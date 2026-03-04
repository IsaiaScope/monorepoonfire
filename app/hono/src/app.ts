/**
 * Main Hono application configuration
 *
 * This file sets up the complete Hono application including:
 * - API routes with OpenAPI documentation
 * - Static file serving for the portfolio frontend
 * - Route type exports for RPC client usage
 */

import { serveStatic } from "@hono/node-server/serve-static";
import { etag } from "hono/etag";

import { APP_HONO } from "./constant";
import { env } from "./environment/env";
import { apiKeyAuth } from "./library/auth-middleware";
import { configureOpenApi } from "./library/configure-open-api";
import { initApp } from "./library/create-app";
import curriculum from "./routes/curriculum/curriculum.index";
import projects from "./routes/projects/projects.index";
import skills from "./routes/skills/skills.index";
import workExperience from "./routes/work-experience/work-experience.index";

// Initialize the Hono application with all middleware configured
const app = initApp();

// Configure OpenAPI documentation endpoints (/doc and /scalar) — development only
if (env.ENV !== "production") {
  configureOpenApi(app);
}

// Require API key for mutating operations (POST/PATCH/DELETE) on API routes
app.use(`${APP_HONO.BASE_PATH}/*`, apiKeyAuth);

/**
 * Register all API routes under the base path defined in constants
 *
 * Route registration order doesn't matter for functionality but follows
 * a logical grouping: skills -> work-experience -> projects -> index
 * All routes are mounted at the root level ("/") but use the base path
 * defined in their individual router configurations
 */
const _routes = app.route(
  "/",
  curriculum, // Mounts /api/curriculum routes
).route(
  "/",
  skills, // Mounts /api/skills routes
).route(
  "/",
  workExperience, // Mounts /api/work-experience routes
).route(
  "/",
  projects, // Mounts /api/projects routes
);

/**
 * ETag middleware — generates content-based ETags and returns 304 Not Modified
 * when the browser sends a matching If-None-Match header.
 */
app.use("*", etag());

/**
 * Static file serving for the portfolio frontend (three-tier caching)
 *
 * 1. /assets/* — Vite content-hashed filenames → immutable, cache forever
 * 2. * (static files) — un-hashed files (.glb, .png, fonts) → cache 1 day
 * 3. * (SPA fallback) — index.html → always revalidate for fresh CSP/security headers
 */
app.get(
  "/assets/*",
  serveStatic({
    root: `.${APP_HONO.PORTFOLIO}`,
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);

app.get(
  "*",
  serveStatic({
    root: `.${APP_HONO.PORTFOLIO}`,
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=86400");
    },
  }),
);

app.get(
  "*",
  serveStatic({
    path: `.${APP_HONO.PORTFOLIO}/index.html`,
    onFound: (_path, c) => {
      c.header("Cache-Control", "no-cache");
    },
  }),
);

// Export the configured application
export default app;

/**
 * Export the route types for use with Hono RPC client
 *
 * This type export enables type-safe API calls from the frontend
 * by providing TypeScript types for all registered routes
 */
export type Routes = typeof _routes;
