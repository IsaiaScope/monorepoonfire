/**
 * Work Experience router configuration
 *
 * This module creates a complete CRUD API for managing work experience data.
 * It includes an additional bulk delete operation for testing purposes.
 */

import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./work-experience.handlers";
import * as routes from "./work-experience.routes";

/**
 * Configure the work experience router with full CRUD operations
 *
 * Provides REST API endpoints for work experience:
 * - GET /api/work-experience - List all work experiences
 * - POST /api/work-experience - Create new work experience
 * - GET /api/work-experience/{id} - Get specific work experience
 * - PATCH /api/work-experience/{id} - Update work experience
 * - DELETE /api/work-experience/{id} - Delete specific work experience
 * - DELETE /api/work-experience - Delete all work experiences (testing)
 */
const router = createApp().basePath(APP_HONO.BASE_PATH).openapi(
  routes.getWorkExperienceRoute, // GET /work-experience - List all
  handlers.getWorkExperienceHandler,
).openapi(
  routes.postWorkExperienceRoute, // POST /work-experience - Create
  handlers.postWorkExperienceHandler,
).openapi(
  routes.getOneWorkExperienceRoute, // GET /work-experience/{id} - Get one
  handlers.getOneWorkExperienceHandler,
).openapi(
  routes.patchWorkExperienceRoute, // PATCH /work-experience/{id} - Update
  handlers.patchWorkExperienceHandler,
).openapi(
  routes.deleteWorkExperienceRoute, // DELETE /work-experience/{id} - Delete one
  handlers.deleteWorkExperienceHandler,
).openapi(
  routes.deleteAllWorkExperienceRoute, // DELETE /work-experience - Delete all
  handlers.deleteAllWorkExperienceHandler,
);

export default router;
