/**
 * Skills API request handlers
 *
 * This module implements the business logic for skills-related API endpoints.
 * Skills management follows a simpler pattern than projects since skills don't
 * have complex nested data structures - just names with uniqueness constraints.
 */

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteSkillsRoute, getOneSkillsRoute, getSkillsRoute, patchSkillsRoute, postSkillsRoute } from "./skills.routes";

import database from "../../database";
import { skills } from "../../database/schema/skills-schema";

/**
 * GET /skills - List all skills handler
 * Retrieves all skills from the database without any transformation needed.
 */
export const getSkillsHandler: AppRouterHandler<typeof getSkillsRoute> = async (c) => {
  const skills = await database.query.skills.findMany();
  return c.json(skills);
};

/**
 * POST /skills - Create new skill handler
 * Creates a new skill with automatic timestamp generation.
 */
export const postSkillsHandler: AppRouterHandler<typeof postSkillsRoute> = async (c) => {
  const skill = c.req.valid("json");
  const skillWithTimestamp = {
    ...skill,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };
  const [createdSkill] = await database.insert(skills).values(skillWithTimestamp).returning();
  return c.json(createdSkill, HttpStatusCodes.OK);
};

/**
 * GET /skills/:id - Get single skill handler
 *
 * Retrieves a specific skill by its ID. Returns a 404 error if the skill
 * doesn't exist. Skills have a simple structure so no data transformation
 * is required.
 *
 * @param c - Hono context with validated route parameters
 * @returns Skill data or 404 error if not found
 */
export const getOneSkillsHandler: AppRouterHandler<typeof getOneSkillsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const skill = await database.query.skills.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!skill) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(skill, HttpStatusCodes.OK);
};

/**
 * PATCH /skills/:id - Update skill handler
 *
 * Updates an existing skill with partial data. Only provided fields are updated
 * while preserving existing data. Automatically updates the timestamp and
 * returns 404 if skill doesn't exist.
 *
 * @param c - Hono context with validated parameters and JSON body
 * @returns Updated skill data or 404 error
 */
export const patchSkillsHandler: AppRouterHandler<typeof patchSkillsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  // Check if skill exists before attempting update
  const skill = await database.query.skills.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!skill) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Merge existing data with updates and add timestamp
  const updatedSkill = {
    ...skill,
    ...updates,
    updatedAt: Date.now().toString(),
  };

  const [updated] = await database.update(skills).set(updatedSkill).where(eq(skills.id, id)).returning();

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
 * DELETE /skills/:id - Delete skill handler
 *
 * Deletes a specific skill by its ID. Returns 404 if the skill doesn't exist.
 * Returns 204 No Content on successful deletion with no response body.
 *
 * @param c - Hono context with validated route parameters
 * @returns 204 No Content on success or 404 error if not found
 */
export const deleteSkillsHandler: AppRouterHandler<typeof deleteSkillsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await database.delete(skills)
    .where(eq(skills.id, id));
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
