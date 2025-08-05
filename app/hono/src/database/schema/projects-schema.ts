/**
 * Projects database schema and validation definitions
 *
 * This module defines the database table structure and Zod validation schemas
 * for the projects entity. It includes both the Drizzle ORM table definition
 * and comprehensive validation schemas for API operations.
 *
 * Projects represent portfolio items with detailed information including
 * descriptions, tags, links, and metadata for showcasing work examples.
 */

import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Projects table definition for Drizzle ORM
 *
 * This table stores portfolio project information with the following structure:
 * - Auto-incrementing primary key
 * - Multilingual support via language field
 * - Complex data stored as JSON strings (subDescription, tags)
 * - URLs for live demo and source code
 * - Audit timestamps for tracking changes
 */
export const projects = sqliteTable("projects", {
  // Primary key with auto-increment
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),

  // Language code for internationalization (e.g., "en-GB", "it-IT")
  language: text("language", { length: 50 }).notNull(),

  // Detailed description stored as JSON string array for rich content
  subDescription: text("subDescription", { length: 2000 }).notNull(), // Store as JSON string array

  // Brief project description for overview display
  description: text("description", { length: 200 }).notNull(),

  // Live demo/deployment URL
  href: text("href", { length: 200 }).notNull(),

  // Source code repository URL
  repo: text("repo", { length: 200 }).notNull(),

  // Project preview image URL
  image: text("image", { length: 200 }).notNull(),

  // Project title/name
  title: text("title", { length: 100 }).notNull(),

  // Technology tags stored as JSON string array of objects
  tags: text("tags", { length: 500 }).notNull(),

  // Audit timestamps stored as string representations
  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
});

/**
 * Complete project validation schema
 *
 * This schema defines the structure and validation rules for project data
 * including all fields, data types, constraints, and OpenAPI documentation.
 * It ensures data integrity and provides automatic API documentation.
 */
const projectsTableSchema = z.object({
  // Unique identifier - positive integer
  id: z.number({ description: "The unique identifier of the project" }).int().positive().openapi({
    example: 3,
  }),

  // Language code for internationalization
  language: z.string({
    description: "The language of the project",
  }).nonempty().max(50).openapi({
    example: "en-GB",
  }),

  // Project title - required, non-empty string
  title: z.string({
    description: "The title of the project",
  }).nonempty().max(100).openapi({
    example: "Note Blog",
  }),

  // Brief description for overview cards
  description: z.string({
    description: "A brief description of the project",
  }).nonempty().max(200).openapi({
    example: "This is a brief description of the project.",
  }),

  // Detailed feature descriptions as array of strings
  subDescription: z.array(z.string().nonempty()).openapi({
    description: "A detailed description of the project as array of strings",
    example: ["Feature 1 description", "Feature 2 description", "Additional details"],
  }),

  // Technology tags with ID and name structure
  tags: z.array(z.object({
    id: z.number().int().positive(),
    name: z.string().nonempty(),
  })).openapi({
    description: "An array of tags associated with the project",
    example: [{ id: 1, name: "JavaScript" }, { id: 2, name: "Markdown" }],
  }),

  // Live demo URL for the deployed project
  href: z.string({
    description: "The URL of the project",
  }).nonempty().max(200).openapi({
    example: "https://garden-on-fire.vercel.app/",
  }),

  // Source code repository URL
  repo: z.string({
    description: "The repository URL of the project",
  }).nonempty().max(200).openapi({
    example: "https://github.com/IsaiaScope/garden-on-fire",
  },
  ),

  // Project preview image URL
  image: z.string({
    description: "The image URL of the project",
  }).nonempty().max(200).openapi({
    example: "/assets/garden-on-fire.png",
  }),

  // Creation timestamp as string
  createdAt: z.string({
    description: "The timestamp when the project was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),

  // Last update timestamp as string
  updatedAt: z.string({ description: "The timestamp when the project was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

/**
 * Schema for selecting/reading projects from the database
 *
 * This schema includes all fields and is used for API responses
 * and database query results. It represents the complete project object.
 */
export const selectProjectsSchema = projectsTableSchema;

/**
 * Schema for inserting/creating new projects
 *
 * This schema excludes auto-generated fields (id, timestamps) and is used
 * for validating new project creation requests. The excluded fields are
 * handled automatically by the system.
 */
export const insertProjectsSchema = projectsTableSchema.omit({
  id: true, // Auto-generated primary key
  createdAt: true, // Set automatically on creation
  updatedAt: true, // Set automatically on updates
});
