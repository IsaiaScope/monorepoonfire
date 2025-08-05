/**
 * Work Experience database schema and validation definitions
 *
 * This module defines the database structure and validation schemas for work
 * experience entries. Work experiences represent professional employment history,
 * internships, freelance work, and other career-related positions that showcase
 * professional growth and expertise.
 *
 * The schema supports internationalization and includes both brief and detailed
 * descriptions to accommodate different display contexts (cards vs. detailed views).
 */

import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Work experiences table definition for Drizzle ORM
 *
 * This table stores comprehensive professional experience information:
 * - Multilingual support for international portfolios
 * - Role and company information for professional context
 * - Location data for geographic context
 * - Dual descriptions (short/long) for different UI contexts
 * - Date ranges for timeline visualization
 * - Audit timestamps for change tracking
 */
export const workExperiences = sqliteTable("work-experience", {
  // Primary key with auto-increment
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),

  // Language code for internationalization support as en-GB, it-IT, etc.
  language: text("language", { length: 50 }).notNull(),

  // Job title/role name
  role: text("name", { length: 100 }).notNull(),

  // Company/organization name
  company: text("company", { length: 100 }).notNull(),

  // Work location (city, state/country)
  location: text("location", { length: 100 }).notNull(),

  // Detailed description for full experience view
  longDescription: text("description", { length: 1000 }).notNull(),

  // Brief description for cards and overview displays
  shortDescription: text("shortDescription", { length: 500 }).notNull(),

  // Employment start date (flexible format)
  startDate: text("startDate", { length: 50 }).notNull(),

  // Employment end date (flexible format, can be "Present" for current roles)
  endDate: text("endDate", { length: 50 }).notNull(),

  // Audit timestamps stored as strings
  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
});

/**
 * Complete work experience validation schema
 *
 * Defines the structure, validation rules, and OpenAPI documentation
 * for work experience data. Includes comprehensive field validation
 * and examples for API documentation.
 */
const workExperiencesTableSchema = z.object({
  // Unique identifier - positive integer
  id: z.number({ description: "The unique identifier of the work experience" }).int().positive().openapi({
    example: 3,
  }),

  // Language code for internationalization
  language: z.string({
    description: "The language of the work experience",
  }).nonempty().max(50).openapi({
    example: "en-GB",
  }),

  // Job title/role
  role: z.string({
    description: "The role of the work experience",
  }).nonempty().max(100).openapi({
    example: "Software Engineer",
  }),

  // Company name
  company: z.string({
    description: "The company where the work experience took place",
  }).nonempty().max(100).openapi({
    example: "Tech Company",
  }),

  // Work location
  location: z.string({
    description: "The location of the work experience",
  }).nonempty().max(100).openapi({
    example: "San Francisco, CA",
  }),

  // Detailed description for comprehensive view
  longDescription: z.string({
    description: "A detailed description of the work experience",
  }).nonempty().max(1000).openapi({
    example: "Worked on various projects involving web development and cloud computing.",
  }),

  // Brief description for overview displays
  shortDescription: z.string({
    description: "A brief description of the work experience",
  }).nonempty().max(500).openapi({
    example: "Developed web applications and managed cloud infrastructure.",
  }),

  // Employment start date
  startDate: z.string({
    description: "The start date of the work experience",
  }).nonempty().max(50).openapi({
    example: "2022-01",
  }),

  // Employment end date
  endDate: z.string({
    description: "The end date of the work experience",
  }).nonempty().max(50).openapi({
    example: "2023-01",
  }),

  // Creation timestamp
  createdAt: z.string({
    description: "The timestamp when the work experience was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),

  // Last update timestamp
  updatedAt: z.string({ description: "The timestamp when the work experience was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

/**
 * Schema for selecting/reading work experiences from the database
 *
 * Includes all fields and is used for API responses and query results.
 */
export const selectWorkExperiencesSchema = workExperiencesTableSchema;

/**
 * Schema for inserting/creating new work experiences
 *
 * Excludes auto-generated fields (id, timestamps) and is used for
 * validating work experience creation requests.
 */
export const insertWorkExperiencesSchema = workExperiencesTableSchema.omit({
  id: true, // Auto-generated primary key
  createdAt: true, // Set automatically on creation
  updatedAt: true, // Set automatically on updates
});
