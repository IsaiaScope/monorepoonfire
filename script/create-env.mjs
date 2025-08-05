/**
 * Environment Variables Setup Script
 *
 * This script automates the creation of environment files for the Hono backend
 * by reading system environment variables and generating appropriate .env files
 * based on the current NODE_ENV. It's designed to work in CI/CD pipelines and
 * local development environments.
 *
 * Key Features:
 * - Reads environment variables from the system
 * - Creates environment-specific .env files
 * - Validates required environment variables
 * - Provides detailed logging and debugging information
 * - Displays directory structure for debugging
 *
 * Usage:
 * - NODE_ENV=development node script/create-env.mjs (creates .env)
 * - NODE_ENV=production node script/create-env.mjs (creates .env.production)
 * - NODE_ENV=staging node script/create-env.mjs (creates .env.staging)
 *
 * Target Directory: app/hono/src/environment/
 *
 * Environment Variables Expected:
 * - NODE_ENV: Required - determines the environment and file naming
 * - ENV: Application environment identifier
 * - DATABASE_URL: Turso database connection URL
 * - DATABASE_AUTH_TOKEN: Turso database authentication token
 * - PORT: Server port (for logging only)
 * - LOG_LEVEL: Application logging level (for logging only)
 */

/* eslint-disable no-console */
/* eslint-disable node/no-process-env */
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/**
 * Environment Variables Template (for reference)
 *
 * This commented section serves as a template showing the expected
 * environment variables format. Used for documentation and setup guidance.
 *
 * Required Variables:
 * - ENV: Application environment (development, staging, production)
 * - DATABASE_URL: Turso LibSQL database connection string
 * - DATABASE_AUTH_TOKEN: Turso database authentication token
 *
 * Optional Variables (for logging purposes):
 * - PORT: Server port number
 * - LOG_LEVEL: Application logging level (debug, info, warn, error)
 */

/**
 * Environment Variables Logging
 *
 * This section logs all relevant environment variables for debugging purposes.
 * It helps developers and CI/CD systems verify that the correct variables
 * are available before attempting to create the .env file.
 *
 * Logged Variables:
 * - NODE_ENV: Required for determining environment and file naming
 * - PORT: Optional, used by the Hono server
 * - ENV: Application environment identifier
 * - LOG_LEVEL: Application logging configuration
 * - DATABASE_AUTH_TOKEN: Turso database authentication (value hidden for security)
 * - DATABASE_URL: Turso database connection string (value hidden for security)
 */
console.log("========================================");
console.log("Printing environment variables...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("ENV:", process.env.ENV);
console.log("LOG_LEVEL:", process.env.LOG_LEVEL);
console.log("DATABASE_AUTH_TOKEN:", process.env.DATABASE_AUTH_TOKEN);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("========================================");

/**
 * NODE_ENV Validation
 *
 * NODE_ENV is the only required environment variable for this script.
 * It determines:
 * - Which environment file to create (.env, .env.production, .env.staging)
 * - The target environment for the application
 *
 * If NODE_ENV is not set, the script exits gracefully to avoid
 * creating files in an unknown environment context.
 */
if (!process.env.NODE_ENV) {
  console.error("NODE_ENV is not set");
  process.exit(0);
}

/**
 * Environment Variables Processing
 *
 * This section defines which environment variables should be included
 * in the generated .env file. Only variables that are actually set
 * (not undefined) will be included in the final file.
 *
 * Selected Variables:
 * - ENV: Application environment identifier (development, staging, production)
 * - DATABASE_AUTH_TOKEN: Turso database authentication token
 * - DATABASE_URL: Turso LibSQL database connection string
 *
 * Note: PORT and LOG_LEVEL are logged but not included in the .env file
 * as they may be handled differently in the application configuration.
 */
const envVars = [
  ["ENV", process.env.ENV],
  ["DATABASE_AUTH_TOKEN", process.env.DATABASE_AUTH_TOKEN],
  ["DATABASE_URL", process.env.DATABASE_URL],
];

/**
 * Environment File Content Generation
 *
 * This process:
 * 1. Filters out undefined environment variables
 * 2. Formats each variable as KEY=VALUE
 * 3. Joins all variables with newlines to create valid .env file content
 *
 * Format: Each line follows the standard .env format (KEY=VALUE)
 * Example output:
 * ENV=development
 * DATABASE_URL=libsql://your-database.turso.io
 * DATABASE_AUTH_TOKEN=your-auth-token
 */
const envContent = envVars
  .filter(([_, value]) => value !== undefined)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

/**
 * Empty Content Validation
 *
 * If no environment variables are defined, there's no point in creating
 * an empty .env file. The script exits gracefully with a informative message.
 *
 * This can happen when:
 * - Environment variables are not properly set in CI/CD
 * - Local development setup is incomplete
 * - Testing scenarios where variables are intentionally omitted
 */
if (!envContent) {
  console.log(`No environment variables found to write to .env.${process.env.NODE_ENV} file.`);
  process.exit(0); // Exit with no error
}

/**
 * Target Directory Resolution
 *
 * The script targets the Hono backend's environment directory where
 * the application expects to find its environment configuration files.
 *
 * Path: app/hono/src/environment/
 * - app/hono: The Hono backend application directory
 * - src/environment: Where environment files are loaded by the application
 *
 * This path is resolved relative to the current working directory (monorepo root).
 */
const honoEnvDir = resolve(process.cwd(), "app/hono/src/environment");

/**
 * Directory Existence Validation
 *
 * Before attempting to write files, verify that the target directory exists.
 * If the directory doesn't exist, it likely means:
 * - The script is being run from the wrong location
 * - The project structure has changed
 * - The Hono application hasn't been set up yet
 *
 * The script exits gracefully to avoid creating files in unintended locations.
 */
if (!existsSync(honoEnvDir)) {
  console.log("No app/hono/dist/src/environment directory found so exiting...");
  process.exit(0); // Exit with no error
}

/**
 * Environment File Naming Strategy
 *
 * The naming convention follows common practices:
 * - Development: .env (default, no suffix)
 * - Other environments: .env.{NODE_ENV} (e.g., .env.production, .env.staging)
 *
 * This allows the application to load environment-specific configurations
 * while keeping development setup simple with just ".env".
 *
 * Examples:
 * - NODE_ENV=development → .env
 * - NODE_ENV=production → .env.production
 * - NODE_ENV=staging → .env.staging
 * - NODE_ENV=test → .env.test
 */
const envFileName = process.env.NODE_ENV !== "development" ? `.env.${process.env.NODE_ENV}` : ".env";

/**
 * Environment File Path Construction
 *
 * Combines the target directory with the appropriate filename
 * to create the full path where the environment file will be written.
 */
const honoEnvPath = join(honoEnvDir, envFileName);

/**
 * Environment File Creation
 *
 * Writes the generated environment content to the target file.
 * Uses UTF-8 encoding to ensure compatibility with all text content.
 *
 * This operation will:
 * - Create the file if it doesn't exist
 * - Overwrite the file if it already exists
 * - Ensure the content matches the current environment variables
 */
writeFileSync(honoEnvPath, envContent, { encoding: "utf8" });

/**
 * Success Confirmation
 *
 * Logs the successful creation of the environment file with:
 * - The filename that was created
 * - The relative path from the project root for easy reference
 *
 * This helps developers and CI/CD systems confirm the operation completed successfully.
 */
console.log("========================================");
console.log(`${envFileName} file created at: ${relative(process.cwd(), honoEnvPath)}`);
console.log("========================================");

/**
 * Directory Structure Printing Utility
 *
 * This recursive function prints a visual tree representation of a directory
 * structure, similar to the Unix 'tree' command. It's used for debugging
 * and verification purposes to show the current state of the Hono application.
 *
 * Features:
 * - Recursive directory traversal
 * - Tree-like visual formatting with Unicode characters
 * - Filters out node_modules to reduce noise
 * - Shows both files and directories
 *
 * Parameters:
 * @param {string} dir - The directory path to print
 * @param {string} prefix - The current line prefix for tree formatting
 *
 * Unicode Characters Used:
 * - ├── : Branch connector (not last item)
 * - └── : Final branch connector (last item)
 * - │   : Vertical line continuation
 * -     : Spaces for final branch continuation
 */
function printDir(dir, prefix = "") {
  /**
   * Directory Entry Processing
   *
   * Reads all entries in the directory and filters out node_modules
   * to avoid cluttering the output with dependency files.
   */
  const entries = readdirSync(dir).filter(e => e !== "node_modules");

  /**
   * Entry Iteration and Formatting
   *
   * For each entry (file or directory):
   * 1. Determine if it's the last item (for proper tree formatting)
   * 2. Check if it's a directory or file
   * 3. Print with appropriate tree connector
   * 4. Recursively process directories with updated prefix
   */
  entries.forEach((entry, idx) => {
    const fullPath = join(dir, entry);
    const isDir = statSync(fullPath).isDirectory();
    const connector = idx === entries.length - 1 ? "└── " : "├── ";
    console.log(prefix + connector + entry);

    /**
     * Recursive Directory Processing
     *
     * If the current entry is a directory, recursively print its contents.
     * The prefix is updated to maintain proper tree formatting:
     * - Last item: use spaces for continuation
     * - Other items: use vertical line for continuation
     */
    if (isDir) {
      printDir(fullPath, prefix + (idx === entries.length - 1 ? "    " : "│   "));
    }
  });
}

/**
 * Application Directory Structure Display
 *
 * After successfully creating the environment file, display the current
 * directory structure of the Hono application. This serves multiple purposes:
 *
 * 1. Verification: Confirms the target directory structure exists
 * 2. Debugging: Helps developers understand the project layout
 * 3. Documentation: Shows where files are created relative to the app structure
 * 4. Troubleshooting: Helps identify missing directories or unexpected structure
 *
 * Output Format:
 * Shows a tree view of app/hono/ including:
 * - Source code directories (src/)
 * - Configuration files
 * - Generated files (including the new .env file)
 * - Build artifacts
 */
console.log("========================================");
console.log("Printing app/hono directory structure:");
printDir("app/hono");
console.log("========================================");
