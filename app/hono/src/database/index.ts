/**
 * Database connection and configuration
 *
 * This module sets up the main database connection using Drizzle ORM with LibSQL.
 * It configures the database client, imports all schema definitions, and exports
 * a ready-to-use database instance for the application.
 *
 * LibSQL is a fork of SQLite that's designed for edge computing and provides
 * compatibility with Turso (serverless SQLite platform).
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "../environment/env";
import * as projectsSchema from "./schema/projects-schema";
import * as skillsSchema from "./schema/skills-schema";
import * as workExperienceSchema from "./schema/work-experience-schema";

/**
 * Create LibSQL client with authentication
 *
 * The client connects to a remote LibSQL/Turso database using:
 * - DATABASE_URL: The connection URL for the database
 * - DATABASE_AUTH_TOKEN: Authentication token (optional in development)
 */
const client = createClient({
  url: env.DATABASE_URL, // Database connection URL from environment
  authToken: env.DATABASE_AUTH_TOKEN, // Authentication token (required for production)
});

/**
 * Initialize Drizzle ORM instance
 *
 * This creates the main database instance with:
 * - LibSQL client for database operations
 * - Combined schema from all entity schemas (skills, work experience, projects)
 * - Type-safe query building and execution
 *
 * The schema object combines all individual schemas to provide a complete
 * view of the database structure for Drizzle's query builder.
 */
const database = drizzle(client, {
  schema: {
    ...skillsSchema, // Skills table and related schemas
    ...workExperienceSchema, // Work experience table and related schemas
    ...projectsSchema, // Projects table and related schemas
  },
});

export default database;
