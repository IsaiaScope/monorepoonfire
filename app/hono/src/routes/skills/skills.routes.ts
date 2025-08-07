/**
 * Skills API route definitions
 *
 * This module defines all the OpenAPI route specifications for the skills
 * endpoints. Skills represent technologies, programming languages, frameworks,
 * and other technical competencies. The API provides simple CRUD operations
 * with validation and comprehensive error handling.
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { APP_HONO } from "../../constant";
import { notFoundSchema } from "../../constant/schema";
import { insertSkillsSchema, selectSkillsSchema } from "../../database/schema/skills-schema";

// Common configuration for all skill routes
const path = APP_HONO.ROUTES.SKILLS; // Base path for all skill endpoints
const tags = ["Skills"]; // OpenAPI tag for grouping routes in documentation

/**
 * GET /skills - List all skills
 *
 * Returns an array of all skills in the database. Skills are simple
 * entities with just names and timestamps, making this endpoint
 * straightforward for retrieving the complete skill set.
 */
export const getSkillsRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectSkillsSchema), // Array of skill objects
      "The list of skills", // OpenAPI response description
    ),
  },
});

/**
 * POST /skills - Create a new skill
 *
 * Creates a new skill with the provided data. Skills have a simple
 * structure requiring only a name. The system automatically generates
 * timestamps and validates uniqueness constraints.
 */
export const postSkillsRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertSkillsSchema, "The skill to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSkillsSchema, // The created skill object
      "The created skill",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSkillsSchema), // Validation error details
      "The validation error(s)",
    ),
  },
});

/**
 * GET /skills/{id} - Get a specific skill
 *
 * Retrieves a single skill by its ID. Returns 404 if the skill
 * doesn't exist, or 422 if the ID parameter is invalid.
 */
export const getOneSkillsRoute = createRoute({
  path: `${path}/{id}`, // Route with ID parameter
  tags,
  method: "get",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSkillsSchema, // The requested skill object
      "The requested skill",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Standard 404 error response
      "The skill was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema), // ID parameter validation errors
      "The validation error(s)",
    ),
  },
});

/**
 * PATCH /skills/{id} - Update a skill
 *
 * Updates an existing skill with partial data. Since skills have a simple
 * structure (primarily just names), this typically involves updating the
 * skill name while preserving timestamps and other metadata.
 */
export const patchSkillsRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
    body: jsonContentRequired(
      insertSkillsSchema, // The skill update data
      "The skill to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSkillsSchema, // The updated skill object
      "The updated skill",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Skill not found error
      "The skill was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertSkillsSchema), // Either ID or body validation errors
      ),
      "The validation error(s)",
    ),
  },
});

/**
 * DELETE /skills/{id} - Delete a specific skill
 *
 * Permanently deletes a skill by its ID. Returns 204 on successful
 * deletion, 404 if the skill doesn't exist, or 422 for invalid IDs.
 */
export const deleteSkillsRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The skill was deleted", // 204 - successful deletion, no content
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Skill not found error
      "The skill was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema), // ID parameter validation errors
      "The validation error(s)",
    ),
  },
});
