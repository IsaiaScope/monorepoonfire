/**
 * Main Hono application configuration
 *
 * This file sets up the complete Hono application including:
 * - API routes with OpenAPI documentation
 * - Static file serving for the portfolio frontend
 * - Route type exports for RPC client usage
 */

import { serveStatic } from "@hono/node-server/serve-static";

import { APP_HONO } from "./constant";
import { configureOpenApi } from "./library/configure-open-api";
import { initApp } from "./library/create-app";
import projects from "./routes/projects/projects.index";
import skills from "./routes/skills/skills.index";
import workExperience from "./routes/work-experience/work-experience.index";

// Initialize the Hono application with all middleware configured
const app = initApp();

// Configure OpenAPI documentation endpoints (/doc and /scalar)
configureOpenApi(app);

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
  skills, // Mounts /api/skills routes
).route(
  "/",
  workExperience, // Mounts /api/work-experience routes
).route(
  "/",
  projects, // Mounts /api/projects routes
);

/**
 * Static file serving for the portfolio frontend
 *
 * These routes handle serving the built React portfolio application:
 * 1. First route serves static assets (CSS, JS, images, etc.)
 * 2. Second route provides SPA fallback - serves index.html for any unmatched routes
 *
 * This enables client-side routing to work properly in the React application
 */
app.get("*", serveStatic({ root: `.${APP_HONO.PORTFOLIO}` })); // Serve static files
app.get("*", serveStatic({ path: `.${APP_HONO.PORTFOLIO}/index.html` })); // SPA fallback

// Export the configured application
export default app;

/**
 * Export the route types for use with Hono RPC client
 *
 * This type export enables type-safe API calls from the frontend
 * by providing TypeScript types for all registered routes
 */
export type Routes = typeof _routes;
