/**
 * Skills router configuration
 *
 * This module creates a complete CRUD API for managing skills data.
 * It follows the same pattern as projects but for skills management.
 */

import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./skills.handlers";
import * as routes from "./skills.routes";

/**
 * Configure the skills router with CRUD operations
 *
 * Provides REST API endpoints for skills:
 * - GET /api/skills - List all skills
 * - POST /api/skills - Create new skill
 * - GET /api/skills/{id} - Get specific skill
 * - PATCH /api/skills/{id} - Update skill
 * - DELETE /api/skills/{id} - Delete skill
 */
const router = createApp().basePath(APP_HONO.BASE_PATH).openapi(
  routes.getSkillsRoute, // GET /skills - List all
  handlers.getSkillsHandler,
).openapi(
  routes.postSkillsRoute, // POST /skills - Create new
  handlers.postSkillsHandler,
).openapi(
  routes.getOneSkillsRoute, // GET /skills/{id} - Get one
  handlers.getOneSkillsHandler,
).openapi(
  routes.patchSkillsRoute, // PATCH /skills/{id} - Update
  handlers.patchSkillsHandler,
).openapi(
  routes.deleteSkillsRoute, // DELETE /skills/{id} - Delete
  handlers.deleteSkillsHandler,
);

export default router;
