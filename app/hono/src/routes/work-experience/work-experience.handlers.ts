/**
 * Work Experience API request handlers
 *
 * This module implements the business logic for work experience-related API endpoints.
 * It handles database operations, data transformations, and error responses
 * for the complete CRUD functionality. Work experience entries track professional
 * history with detailed descriptions, dates, and localization support.
 */

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteAllWorkExperienceRoute, deleteWorkExperienceRoute, getOneWorkExperienceRoute, getWorkExperienceRoute, patchWorkExperienceRoute, postWorkExperienceRoute } from "./work-experience.routes";

import database from "../../database";
import { workExperiences } from "../../database/schema/work-experience-schema";

/**
 * GET /work-experience - List all work experience entries handler
 *
 * Retrieves all work experience entries from the database. The entries include
 * detailed professional history with role, company, location, descriptions,
 * and date information for portfolio display.
 *
 * @param c - Hono context
 * @returns Array of work experience entries
 */
export const getWorkExperienceHandler: AppRouterHandler<typeof getWorkExperienceRoute> = async (c) => {
  const workExperience = await database.query.workExperiences.findMany();
  return c.json(workExperience);
};

/**
 * POST /work-experience - Create new work experience entry handler
 *
 * Creates a new work experience entry with comprehensive professional details.
 * Automatically adds timestamps for creation tracking and supports multiple
 * languages for internationalization.
 *
 * @param c - Hono context with validated JSON body containing work experience data
 * @returns Created work experience entry with generated ID and timestamps
 */
export const postWorkExperienceHandler: AppRouterHandler<typeof postWorkExperienceRoute> = async (c) => {
  const workExperience = c.req.valid("json");
  const workExperienceWithTimestamp = {
    ...workExperience,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };
  const [createdWorkExperience] = await database.insert(workExperiences).values(workExperienceWithTimestamp).returning();
  return c.json(createdWorkExperience, HttpStatusCodes.OK);
};

/**
 * GET /work-experience/:id - Get single work experience entry handler
 *
 * Retrieves a specific work experience entry by its ID. Returns detailed
 * professional information including role, company, location, descriptions,
 * and employment dates. Returns 404 if the entry doesn't exist.
 *
 * @param c - Hono context with validated route parameters
 * @returns Work experience entry data or 404 error if not found
 */
export const getOneWorkExperienceHandler: AppRouterHandler<typeof getOneWorkExperienceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const workExperience = await database.query.workExperiences.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!workExperience) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(workExperience, HttpStatusCodes.OK);
};

/**
 * PATCH /work-experience/:id - Update work experience entry handler
 *
 * Updates an existing work experience entry with partial data. Only provided
 * fields are updated while preserving existing data. Supports updating any
 * combination of professional details including role, company, location,
 * descriptions, and employment dates. Automatically updates the timestamp.
 *
 * @param c - Hono context with validated parameters and JSON body
 * @returns Updated work experience entry or 404 error if not found
 */
export const patchWorkExperienceHandler: AppRouterHandler<typeof patchWorkExperienceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  // Check if work experience exists before attempting update
  const workExperience = await database.query.workExperiences.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!workExperience) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Merge existing data with updates and add timestamp
  const updatedWorkExperience = {
    ...workExperience,
    ...updates,
    updatedAt: Date.now().toString(),
  };

  const [updated] = await database.update(workExperiences).set(updatedWorkExperience).where(eq(workExperiences.id, id)).returning();

  if (!updated) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

/**
 * DELETE /work-experience/:id - Delete work experience entry handler
 *
 * Deletes a specific work experience entry by its ID. Returns 404 if the entry
 * doesn't exist. Returns 204 No Content on successful deletion with no response body.
 *
 * @param c - Hono context with validated route parameters
 * @returns 204 No Content on success or 404 error if not found
 */
export const deleteWorkExperienceHandler: AppRouterHandler<typeof deleteWorkExperienceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await database.delete(workExperiences)
    .where(eq(workExperiences.id, id));
  if (!result.rowsAffected) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

/**
 * DELETE /work-experience - Delete all work experience entries handler
 *
 * Removes all work experience entries from the database. This is a destructive
 * operation typically used for testing or administrative purposes. Returns 204
 * No Content on successful completion.
 *
 * ⚠️ WARNING: This operation permanently removes all work experience data!
 *
 * Note: ESLint disable comment is used because Drizzle ORM requires explicit
 * WHERE clauses for safety, but this operation intentionally deletes all records.
 *
 * @param c - Hono context (no parameters required)
 * @returns 204 No Content on successful deletion
 */
export const deleteAllWorkExperienceHandler: AppRouterHandler<typeof deleteAllWorkExperienceRoute> = async (c) => {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await database.delete(workExperiences);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
