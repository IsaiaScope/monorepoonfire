/**
 * Drizzle ORM Configuration
 *
 * This file configures Drizzle Kit for database operations including migrations,
 * schema management, and database introspection. Drizzle Kit is a CLI tool that
 * helps manage database schemas and generate type-safe migrations.
 *
 * Key Features:
 * - Automatic migration generation from schema changes
 * - Type-safe database operations
 * - Support for multiple database dialects
 * - Integration with Turso (LibSQL) for serverless databases
 *
 * References:
 * - Tutorial: https://youtu.be/sNh9PoM9sUE?si=VxZt164ed8L7y3ni&t=4178
 * - Documentation: https://orm.drizzle.team/docs/drizzle-config-file
 */

import { defineConfig } from "drizzle-kit";

import env from "./src/environment/env";

/**
 * Drizzle Kit Configuration
 *
 * This configuration object defines how Drizzle Kit should interact with
 * your database and schema files. It includes settings for schema location,
 * migration output, database connection, and operational preferences.
 */
export default defineConfig({
  /**
   * Schema Path Configuration
   *
   * Specifies the location of your database schema files. Drizzle Kit will
   * scan these files to understand your database structure and generate
   * appropriate migrations when changes are detected.
   *
   * Pattern: "./src/database/schema/*.ts"
   * - Includes all TypeScript files in the schema directory
   * - Supports multiple schema files for better organization
   * - Files should export Drizzle table definitions
   */
  schema: "./src/database/schema/*.ts",

  /**
   * Migration Output Directory
   *
   * Defines where Drizzle Kit should place generated migration files.
   * These files contain SQL statements that represent changes to your
   * database schema over time.
   *
   * Features:
   * - Automatically generated migration files
   * - Timestamped for proper ordering
   * - Version controlled for team collaboration
   * - Rollback support for schema changes
   */
  out: "./src/database/migrations",

  /**
   * Database Dialect
   *
   * Specifies the SQL dialect to use for migration generation.
   * "turso" indicates we're using Turso (LibSQL), which is a
   * serverless SQLite-compatible database service.
   *
   * Turso Benefits:
   * - Edge deployment for low latency
   * - SQLite compatibility with enhanced features
   * - Automatic scaling and replication
   * - Built-in authentication and security
   */
  dialect: "turso",

  /**
   * Database Connection Credentials
   *
   * Configuration for connecting to the Turso database instance.
   * Uses environment variables for security and flexibility across
   * different deployment environments.
   */
  dbCredentials: {
    /**
     * Database URL
     *
     * The connection URL for your Turso database instance.
     * Format: libsql://[database-name]-[organization].turso.io
     *
     * Retrieved from environment variables for security.
     */
    url: env.DATABASE_URL,

    /**
     * Authentication Token
     *
     * The authentication token required to connect to your Turso database.
     * This token provides secure access to your database instance and
     * should be kept confidential.
     *
     * Retrieved from environment variables for security.
     */
    authToken: env.DATABASE_AUTH_TOKEN,
  },

  /**
   * Verbose Logging
   *
   * Enables detailed logging during Drizzle Kit operations.
   * Useful for debugging migration issues and understanding
   * what operations are being performed.
   *
   * When enabled, you'll see:
   * - Detailed migration steps
   * - SQL statements being executed
   * - Connection status information
   * - Error details for troubleshooting
   */
  verbose: true,
});
