/**
 * Work Experience API route definitions
 *
 * This module defines all the OpenAPI route specifications for the work experience
 * endpoints. Work experience entries represent professional history including roles,
 * companies, locations, descriptions, and employment dates. The API supports
 * comprehensive CRUD operations with detailed validation and internationalization.
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { APP_HONO } from "../../constant";
import { notFoundSchema } from "../../constant/schema";
import { insertWorkExperiencesSchema, selectWorkExperiencesSchema } from "../../database/schema/work-experience-schema";

// Common configuration for all work experience routes
const path = APP_HONO.ROUTES.WORK_EXPERIENCE; // Base path for all work experience endpoints
const tags = ["Work Experience"]; // OpenAPI tag for grouping routes in documentation

/**
 * GET /work-experience - List all work experience entries
 *
 * Returns an array of all work experience entries in the database.
 * Each entry contains comprehensive professional information including
 * role, company, location, descriptions, and employment dates.
 */
export const getWorkExperienceRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectWorkExperiencesSchema), // Array of work experience objects
      "The list of work experiences", // OpenAPI response description
    ),
  },
});

/**
 * POST /work-experience - Create a new work experience entry
 *
 * Creates a new work experience entry with comprehensive professional details.
 * Supports multiple languages and validates all required fields including
 * role, company, location, descriptions, and employment dates.
 */
export const postWorkExperienceRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertWorkExperiencesSchema, "The work experience to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkExperiencesSchema, // The created work experience object
      "The created work experience",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertWorkExperiencesSchema), // Validation error details
      "The validation error(s)",
    ),
  },
});

/**
 * GET /work-experience/{id} - Get a specific work experience entry
 *
 * Retrieves a single work experience entry by its ID. Returns detailed
 * professional information or appropriate error responses for missing
 * entries or invalid parameters.
 */
export const getOneWorkExperienceRoute = createRoute({
  path: `${path}/{id}`, // Route with ID parameter
  tags,
  method: "get",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkExperiencesSchema, // The requested work experience object
      "The requested work experience",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Standard 404 error response
      "The work experience was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema), // ID parameter validation errors
      "The validation error(s)",
    ),
  },
});

/**
 * PATCH /work-experience/{id} - Update a work experience entry
 *
 * Updates an existing work experience entry with partial data. Supports
 * updating any combination of professional details including role, company,
 * location, descriptions, and employment dates. Maintains data integrity
 * and validates all provided fields.
 */
export const patchWorkExperienceRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
    body: jsonContentRequired(
      insertWorkExperiencesSchema, // The work experience update data
      "The work experience to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkExperiencesSchema, // The updated work experience object
      "The updated work experience",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Work experience not found error
      "The work experience was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertWorkExperiencesSchema), // Either ID or body validation errors
      ),
      "The validation error(s)",
    ),
  },
});

/**
 * DELETE /work-experience/{id} - Delete a specific work experience entry
 *
 * Permanently deletes a work experience entry by its ID. Returns 204 on
 * successful deletion, 404 if the entry doesn't exist, or 422 for invalid IDs.
 */
export const deleteWorkExperienceRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema, // Validates the ID parameter
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The work experience was deleted", // 204 - successful deletion, no content
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema, // Work experience not found error
      "The work experience was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema), // ID parameter validation errors
      "The validation error(s)",
    ),
  },
});

/**
 * DELETE /work-experience - Delete all work experience entries
 *
 * Permanently deletes ALL work experience entries from the database. This is
 * primarily intended for testing and cleanup purposes. Use with extreme caution
 * in production environments.
 *
 * WARNING: This operation cannot be undone!
 */
export const deleteAllWorkExperienceRoute = createRoute({
  path,
  tags,
  method: "delete",
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "All work experiences were deleted", // 204 - successful bulk deletion
    },
  },
});
