/**
 * Projects API request handlers
 *
 * This module implements the business logic for all project-related API endpoints.
 * It handles database operations, data transformations, and error responses
 * for the complete CRUD functionality.
 */

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteAllProjectsRoute, deleteProjectRoute, getOneProjectRoute, getProjectsRoute, patchProjectRoute, postProjectRoute } from "./projects.routes";

import database from "../../database";
import { projects } from "../../database/schema/projects-schema";

/**
 * Transform project data for API output
 *
 * Projects store complex data (subDescription, tags) as JSON strings in the database
 * for compatibility. This function converts them back to JavaScript objects for
 * the API response.
 *
 * @param project - Raw project data from database
 * @returns Transformed project with parsed JSON fields
 */
function transformProjectForOutput(project: typeof projects.$inferSelect) {
  return {
    ...project,
    // Parse subDescription from JSON string to array
    subDescription: typeof project.subDescription === "string"
      ? JSON.parse(project.subDescription)
      : project.subDescription,
    // Parse tags from JSON string to array of objects
    tags: typeof project.tags === "string"
      ? JSON.parse(project.tags)
      : project.tags,
  };
}

/**
 * GET /projects - List all projects handler
 *
 * Retrieves all projects from the database and transforms them for output.
 * Always returns an array (empty if no projects exist).
 */

export const getProjectsHandler: AppRouterHandler<typeof getProjectsRoute> = async (c) => {
  const projectsList = await database.query.projects.findMany();
  const transformedProjects = projectsList.map(transformProjectForOutput);
  return c.json(transformedProjects);
};

/**
 * POST /projects - Create new project handler
 *
 * Creates a new project with the provided data. Handles data transformation
 * for complex fields (subDescription, tags) by converting them to JSON strings
 * for database storage. Automatically adds timestamps for creation tracking.
 *
 * @param c - Hono context with validated JSON body
 * @returns Created project with transformed data structure
 */
export const postProjectHandler: AppRouterHandler<typeof postProjectRoute> = async (c) => {
  const project = c.req.valid("json");
  // Transform complex data structures to JSON strings for database storage
  const projectWithTimestamp = {
    ...project,
    subDescription: JSON.stringify(project.subDescription),
    tags: JSON.stringify(project.tags),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };
  const [createdProject] = await database.insert(projects).values(projectWithTimestamp).returning();
  return c.json(transformProjectForOutput(createdProject), HttpStatusCodes.OK);
};

/**
 * GET /projects/:id - Get single project handler
 *
 * Retrieves a specific project by its ID. Returns a 404 error if the project
 * doesn't exist. The returned project data is transformed to convert JSON
 * strings back to JavaScript objects for API consumption.
 *
 * @param c - Hono context with validated route parameters
 * @returns Project data with transformed fields or 404 error
 */
export const getOneProjectHandler: AppRouterHandler<typeof getOneProjectRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const project = await database.query.projects.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!project) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(transformProjectForOutput(project), HttpStatusCodes.OK);
};

/**
 * PATCH /projects/:id - Update project handler
 *
 * Updates an existing project with partial data. Only provided fields are updated
 * while preserving existing data. Handles complex field transformations and
 * automatically updates the timestamp. Returns 404 if project doesn't exist.
 *
 * Key features:
 * - Partial updates (only provided fields are changed)
 * - JSON transformation for complex fields (subDescription, tags)
 * - Automatic timestamp management
 * - Existence validation before update
 *
 * @param c - Hono context with validated parameters and JSON body
 * @returns Updated project with transformed data or 404 error
 */
export const patchProjectHandler: AppRouterHandler<typeof patchProjectRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  // Check if project exists before attempting update
  const project = await database.query.projects.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!project) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Prepare update data with JSON transformations for complex fields
  const updatedProjectData = {
    ...updates,
    ...(updates.subDescription && {
      subDescription: JSON.stringify(updates.subDescription),
    }),
    ...(updates.tags && {
      tags: JSON.stringify(updates.tags),
    }),
    updatedAt: Date.now().toString(),
  };

  const [updatedProject] = await database.update(projects).set(updatedProjectData).where(eq(projects.id, id)).returning();
  return c.json(transformProjectForOutput(updatedProject), HttpStatusCodes.OK);
};

/**
 * DELETE /projects/:id - Delete single project handler
 *
 * Deletes a specific project by its ID. Returns 404 if the project doesn't exist.
 * Returns 204 No Content on successful deletion with no response body.
 *
 * @param c - Hono context with validated route parameters
 * @returns 204 No Content on success or 404 error if not found
 */
export const deleteProjectHandler: AppRouterHandler<typeof deleteProjectRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Verify project exists before deletion
  const project = await database.query.projects.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!project) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await database.delete(projects).where(eq(projects.id, id));
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

/**
 * DELETE /projects - Delete all projects handler
 *
 * Removes all projects from the database. This is a destructive operation
 * typically used for testing or administrative purposes. Returns 204 No Content
 * on successful completion.
 *
 * ⚠️ WARNING: This operation permanently removes all project data!
 *
 * Note: ESLint disable comment is used because Drizzle ORM requires explicit
 * WHERE clauses for safety, but this operation intentionally deletes all records.
 *
 * @param c - Hono context (no parameters required)
 * @returns 204 No Content on successful deletion
 */
export const deleteAllProjectsHandler: AppRouterHandler<typeof deleteAllProjectsRoute> = async (c) => {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await database.delete(projects);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
