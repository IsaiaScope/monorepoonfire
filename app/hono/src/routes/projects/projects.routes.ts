/**
 * Projects API route definitions
 *
 * This module defines all the OpenAPI route specifications for the projects
 * endpoints. Each route includes request/response schemas, validation rules,
 * and documentation that automatically generates interactive API docs.
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { APP_HONO } from "../../constant";
import { notFoundSchema } from "../../constant/schema";
import { insertProjectsSchema, selectProjectsSchema } from "../../database/schema/projects-schema";

// Common configuration for all project routes
const path = APP_HONO.ROUTES.PROJECTS; // Base path for all project endpoints
const tags = ["Projects"]; // OpenAPI tag for grouping routes in documentation

/**
 * GET /projects - List all projects
 *
 * Returns an array of all projects in the database. This endpoint
 * requires no parameters and always returns a successful response
 * with an array (which may be empty if no projects exist).
 */
export const getProjectsRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectProjectsSchema), // Array of project objects
      "The list of projects", // OpenAPI response description
    ),
  },
});

/**
 * POST /projects - Create a new project
 *
 * Creates a new project with the provided data. The request body
 * must match the insertProjectsSchema validation rules. Returns
 * the created project with generated ID and timestamps.
 */
export const postProjectRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertProjectsSchema, "The project to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProjectsSchema, // The created project object
      "The created project",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertProjectsSchema), // Validation error details
      "The validation error(s)",
    ),
  },
});

/**
 * GET /projects/{id} - Get a specific project
 *
 * Retrieves a single project by its ID. Returns 404 if the project
 * doesn't exist, or 422 if the ID parameter is invalid.
 */
export const getOneProjectRoute = createRoute({
  path: `${path}/{id}`, // Route with ID parameter
  tags,
  method: "get",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProjectsSchema, // The requested project object
      "The requested project",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Standard 404 error response
      "The project was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema), // ID parameter validation errors
      "The validation error(s)",
    ),
  },
});

/**
 * PATCH /projects/{id} - Update a project
 *
 * Updates an existing project with partial data. Only provided fields
 * will be updated. Returns the updated project or appropriate error
 * responses for validation failures or missing projects.
 */
export const patchProjectRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
    body: jsonContentRequired(insertProjectsSchema, "The project updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProjectsSchema, // The updated project object
      "The updated project",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Project not found error
      "The project was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertProjectsSchema), // Either ID or body validation errors
      ),
      "The validation error(s)",
    ),
  },
});

/**
 * DELETE /projects/{id} - Delete a specific project
 *
 * Permanently deletes a project by its ID. Returns 204 on successful
 * deletion, 404 if the project doesn't exist, or 422 for invalid IDs.
 */
export const deleteProjectRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The project was deleted", // 204 - successful deletion, no content
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Project not found error
      "The project was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema), // ID parameter validation errors
      "The validation error(s)",
    ),
  },
});

/**
 * DELETE /projects - Delete all projects
 *
 * Permanently deletes ALL projects from the database. This is primarily
 * intended for testing and cleanup purposes. Use with extreme caution
 * in production environments.
 *
 * WARNING: This operation cannot be undone!
 */
export const deleteAllProjectsRoute = createRoute({
  path,
  tags,
  method: "delete",
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "All projects were deleted", // 204 - successful bulk deletion
    },
  },
});
