/**
 * Application constants and configuration values
 *
 * This file contains all the core configuration constants used throughout
 * the Hono application. Using a centralized constants file ensures
 * consistency and makes configuration changes easier to manage.
 */

/**
 * Main application configuration object
 *
 * @property BASE_PATH - API base path prefix for all API routes
 * @property PORTFOLIO - Path to the portfolio frontend build directory
 * @property PORT - Default port number for the server (can be overridden by env vars)
 */
export const APP_HONO = {
  BASE_PATH: "/api", // All API routes will be prefixed with /api
  PORTFOLIO: "/portfolio", // Portfolio static files served from this path
  PORT: 3075, // Default server port (development)
  ROUTES: {
    SKILLS: "/skills", // Skills API endpoint
    PROJECTS: "/projects", // Projects API endpoint
    WORK_EXPERIENCE: "/work-experience", // Work experience API endpoint
  },
} as const;
