/**
 * Skills database schema and validation definitions
 *
 * This module defines the database structure and validation schemas for the
 * skills entity. Skills represent technical competencies, programming languages,
 * frameworks, tools, and other professional capabilities that are part of
 * the portfolio showcase.
 *
 * The skills schema is intentionally simple, focusing on skill names with
 * uniqueness constraints to prevent duplicates.
 */

import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Skills table definition for Drizzle ORM
 *
 * A simple table structure for storing skill information:
 * - Auto-incrementing primary key for unique identification
 * - Unique skill name to prevent duplicates
 * - Audit timestamps for tracking when skills are added/updated
 *
 * The unique constraint on name ensures no duplicate skills can be created
 */
export const skills = sqliteTable("skills", {
  // Primary key with auto-increment
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),

  // Skill name - unique constraint prevents duplicates
  name: text("name", { length: 100 }).notNull().unique(),

  // Audit timestamps stored as strings
  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
});

/**
 * Complete skill validation schema
 *
 * Defines the structure and validation rules for skill data including
 * field types, constraints, and OpenAPI documentation examples.
 */
const skillsTableSchema = z.object({
  // Unique identifier - positive integer
  id: z.number({ description: "The unique identifier of the skill" }).int().positive().openapi({
    example: 3,
  }),

  // Skill name - required, non-empty, unique string
  name: z.string({
    description: "The name of the skill",
  }).nonempty().max(100).openapi({
    example: "JavaScript",
  }),

  // Creation timestamp
  createdAt: z.string({
    description: "The timestamp when the skill was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),

  // Last update timestamp
  updatedAt: z.string({ description: "The timestamp when the skill was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

/**
 * Schema for selecting/reading skills from the database
 *
 * Includes all fields and is used for API responses and query results.
 */
export const selectSkillsSchema = skillsTableSchema;

/**
 * Schema for inserting/creating new skills
 *
 * Excludes auto-generated fields (id, timestamps) and is used for
 * validating skill creation requests. Only the skill name is required.
 */
export const insertSkillsSchema = skillsTableSchema.omit({
  id: true, // Auto-generated primary key
  createdAt: true, // Set automatically on creation
  updatedAt: true, // Set automatically on updates
});
