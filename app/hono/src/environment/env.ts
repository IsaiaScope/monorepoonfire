/**
 * Environment configuration and validation
 *
 * This module handles environment variable loading, validation, and type-safe access
 * throughout the application. It uses the @t3-oss/env-core library for robust
 * environment variable validation with Zod schemas, ensuring runtime type safety
 * and proper configuration across different deployment environments.
 *
 * Features:
 * - Environment-specific .env file loading
 * - Runtime validation with detailed error messages
 * - Type-safe access to environment variables
 * - Support for variable expansion (dotenv-expand)
 * - Development, test, and production configurations
 */

/* eslint-disable node/no-process-env */
import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

import { APP_HONO } from "../constant";

/**
 * Cross-platform environment variable management
 *
 * Using cross-env is recommended for scripts that need to work consistently
 * across all operating systems (Linux, macOS, Windows). It ensures environment
 * variables are set properly regardless of the shell being used.
 */

/**
 * dotenv-expand functionality
 *
 * dotenv-expand is a companion package for dotenv that enables environment
 * variable expansion in .env files. This allows referencing other environment
 * variables within values, like:
 *
 * HOST=localhost
 * PORT=3000
 * URL=http://${HOST}:${PORT}
 *
 * This is particularly useful for building complex configuration from simpler parts.
 */

/**
 * Determine the appropriate .env file based on NODE_ENV
 *
 * This function implements environment-specific configuration file loading:
 * - development: .env (default for local development)
 * - test: .env.test (isolated config for testing)
 * - production: .env.production (production-specific settings)
 * - fallback: .env (default for unknown environments)
 *
 * @returns The filename of the appropriate .env file
 */
function getDotEnvFileName() {
  switch (process.env.NODE_ENV) {
    case "development":
      return ".env";
    case "test":
      return ".env.test";
    case "production":
      return ".env.production";
    default:
      return ".env";
  }
}

/**
 * Load and expand environment variables
 *
 * This configuration:
 * 1. Loads the appropriate .env file based on NODE_ENV
 * 2. Resolves the path relative to the project structure
 * 3. Enables variable expansion for complex configurations
 *
 * The path resolution ensures the .env file is found regardless of
 * the current working directory when the application starts.
 */
expand(config({
  path: path.resolve(
    process.cwd(), // Current working directory
    "src", // Source directory
    "environment", // Environment config directory
    getDotEnvFileName(), // Environment-specific file
  ),
}));

/**
 * Create type-safe environment configuration
 *
 * This uses @t3-oss/env-core to create a validated, type-safe environment
 * configuration object. All environment variables are validated at startup,
 * ensuring the application fails fast if configuration is invalid.
 */
export const env = createEnv({
  server: {
    /**
     * Server port configuration
     *
     * Uses Zod's coerce to automatically convert string environment variables
     * to numbers. The coerce method handles type conversion safely.
     *
     * Reference: https://www.youtube.com/watch?v=9Ab1f0MaZc8
     */
    PORT: z
      .coerce // Convert string to number automatically
      .number() // Ensure it's a valid number
      .int() // Must be an integer
      .default(APP_HONO.PORT), // Default from constants if not provided

    /**
     * Application environment
     *
     * Restricts the environment to known values, ensuring consistent
     * behavior across different deployment scenarios.
     */
    ENV: z.enum(["development", "test", "production"]).default("development"),

    /**
     * Logging level configuration
     *
     * Controls the verbosity of application logs. Uses Pino log levels:
     * - trace: Most verbose, includes all debug information
     * - debug: Debug information for development
     * - info: General application information
     * - warn: Warning messages (default)
     * - error: Error messages only
     * - fatal: Only fatal errors
     * - silent: No logging output
     */
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal", "trace", "silent"]).default("warn"),

    /**
     * Database connection URL
     *
     * Must be a valid URL pointing to the LibSQL/Turso database.
     * This is required for all environments and must be properly formatted.
     */
    DATABASE_URL: z.string().url(),

    /**
     * Database authentication token
     *
     * Optional in development for local databases, but required in
     * test and production environments for security. The refinement
     * function implements conditional validation based on the environment.
     */
    DATABASE_AUTH_TOKEN: z.string().optional().refine(
      (val) => {
        // Require DATABASE_AUTH_TOKEN if NODE_ENV is 'test' or 'production'
        if (process.env.NODE_ENV !== "development") {
          return typeof val === "string" && val.length > 0;
        }
        return true; // Optional in development
      },
      {
        message: "DATABASE_AUTH_TOKEN is required in test or production environments",
      },
    ),

    /**
     * CORS allowed origins configuration
     *
     * Comma-separated list of allowed origins for CORS. In development,
     * this should include localhost for local development. In production,
     * this should only include the specific domains that need access.
     */
    CORS_ORIGINS: z.string().default("*"),

    /**
     * SEO domain configuration for Railway hosting
     *
     * CANONICAL_HOST: The primary domain for SEO (www.isaiariva.com)
     * RAILWAY_HOST_SNIPPET: Railway domain pattern to detect and redirect
     */
    CANONICAL_HOST: z.string().default("www.isaiariva.com"),
    RAILWAY_HOST_SNIPPET: z.string().default("up.railway.app"),

  },
  /**
   * Runtime environment source
   *
   * Specifies that environment variables should be read from process.env
   * at runtime. This allows the application to pick up environment variables
   * from the actual runtime environment (Docker, serverless, etc.).
   */
  runtimeEnv: process.env,

  /**
   * Empty string handling
   *
   * When true, empty strings in environment variables are treated as undefined.
   * This is useful for optional environment variables where an empty string
   * should be equivalent to the variable not being set at all.
   */
  emptyStringAsUndefined: true,
});

/**
 * Development utility function for environment debugging
 *
 * This function prints the current environment configuration to the console,
 * including the path to the loaded .env file and the resolved configuration.
 *
 * Useful for:
 * - Debugging configuration issues
 * - Verifying which .env file was loaded
 * - Checking resolved environment variable values
 * - Development and troubleshooting
 *
 * Note: Sensitive values like DATABASE_AUTH_TOKEN are included in the output,
 * so this should only be used in development environments.
 */
export function printEnv() {
  // eslint-disable-next-line no-console
  console.log("[Env]", {
    path: path.resolve(
      process.cwd(),
      "src",
      "environment",
      getDotEnvFileName(),
    ),
    env, // Resolved environment configuration
    NODE_ENV: process.env.NODE_ENV, // Current Node.js environment
  });
}

/**
 * Default export of the validated environment configuration
 *
 * This provides type-safe access to all environment variables throughout
 * the application. The configuration is validated once at startup and
 * then provides compile-time type safety for all subsequent usage.
 *
 * Usage example:
 * ```typescript
 * import env from './environment/env';
 *
 * console.log(`Server running on port ${env.PORT}`);
 * console.log(`Environment: ${env.ENV}`);
 * ```
 */
export default env;
