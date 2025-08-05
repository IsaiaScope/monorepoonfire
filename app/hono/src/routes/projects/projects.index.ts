/**
 * Projects router configuration
 *
 * This module assembles the complete projects API router by combining
 * route definitions with their corresponding handlers. It creates a
 * full CRUD API for managing project data with OpenAPI documentation.
 */

import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./projects.handlers";
import * as routes from "./projects.routes";

/**
 * Configure the projects router with all CRUD operations
 *
 * This router provides a complete REST API for project management:
 * - GET /api/projects - List all projects
 * - POST /api/projects - Create a new project
 * - GET /api/projects/{id} - Get a specific project
 * - PATCH /api/projects/{id} - Update a project
 * - DELETE /api/projects/{id} - Delete a specific project
 * - DELETE /api/projects - Delete all projects (for testing/cleanup)
 *
 * Each route is registered with:
 * - OpenAPI route definition (from projects.routes)
 * - Handler function (from projects.handlers)
 * - Automatic request/response validation
 * - Generated API documentation
 */
const router = createApp().basePath(APP_HONO.BASE_PATH).openapi(
  routes.getProjectsRoute, // GET /projects - List all projects
  handlers.getProjectsHandler,
).openapi(
  routes.postProjectRoute, // POST /projects - Create new project
  handlers.postProjectHandler,
).openapi(
  routes.getOneProjectRoute, // GET /projects/{id} - Get specific project
  handlers.getOneProjectHandler,
).openapi(
  routes.patchProjectRoute, // PATCH /projects/{id} - Update project
  handlers.patchProjectHandler,
).openapi(
  routes.deleteProjectRoute, // DELETE /projects/{id} - Delete project
  handlers.deleteProjectHandler,
).openapi(
  routes.deleteAllProjectsRoute, // DELETE /projects - Delete all projects
  handlers.deleteAllProjectsHandler,
);

export default router;
