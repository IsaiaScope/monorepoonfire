/**
 * Vitest Configuration for Hono Backend
 *
 * This file configures Vitest, a fast unit testing framework for JavaScript/TypeScript.
 * The configuration is specifically tailored for testing the Hono backend API with
 * considerations for database operations, API route testing, and test isolation.
 *
 * Key Features:
 * - Fast test execution with hot reload
 * - TypeScript support out of the box
 * - Jest-compatible API for easy migration
 * - Built-in coverage reporting
 * - Excellent IDE integration
 *
 * References:
 * - Vitest Documentation: https://vitest.dev/
 * - Configuration Guide: https://vitest.dev/config/
 */

import { defineConfig } from "vitest/config";

/**
 * Vitest Test Configuration
 *
 * This configuration object defines how Vitest should execute tests for the
 * Hono backend. The settings are optimized for API testing with database
 * operations that require sequential execution to avoid conflicts.
 */
export default defineConfig({
  /**
   * Test Configuration Options
   *
   * These settings control how tests are executed, including naming,
   * global setup, and concurrency management for database operations.
   */
  test: {
    /**
     * Test Suite Name
     *
     * Identifies this test suite in reports and logs. Useful in monorepo
     * setups where multiple packages have their own test suites.
     *
     * Format: "@app/hono" follows monorepo naming conventions
     * - @app: indicates this is an application package
     * - hono: specifies this is the Hono backend service
     */
    name: "@app/hono",

    /**
     * Global Test APIs
     *
     * When enabled, test functions (describe, it, expect, etc.) are available
     * globally without explicit imports. This provides a cleaner test syntax
     * similar to Jest and reduces boilerplate in test files.
     *
     * Benefits:
     * - No need to import test functions in each file
     * - Cleaner, more readable test code
     * - Jest-like developer experience
     * - Reduced import statements in test files
     *
     * Note: TypeScript users should add vitest/globals to their types
     */
    globals: true,

    /**
     * File-Level Parallelism Control
     *
     * Disables parallel execution of test files. This is crucial for API
     * tests that interact with a shared database, as parallel execution
     * can cause race conditions and test interference.
     *
     * Why disabled for this project:
     * - Database operations need isolation
     * - API tests create/modify/delete shared resources
     * - Prevents race conditions in CRUD operations
     * - Ensures predictable test execution order
     *
     * Trade-off: Slower test execution but more reliable results
     */
    fileParallelism: false,

    /**
     * Maximum Test Concurrency
     *
     * Limits the number of tests that can run simultaneously to 1.
     * This works in conjunction with fileParallelism to ensure complete
     * test isolation for database-dependent operations.
     *
     * Benefits for API testing:
     * - Prevents database lock conflicts
     * - Ensures test data consistency
     * - Avoids resource contention issues
     * - Provides deterministic test results
     *
     * Considerations:
     * - Slower test execution compared to parallel runs
     * - Essential for maintaining test reliability
     * - Particularly important for CRUD operation tests
     * - Prevents flaky tests due to shared state
     */
    maxConcurrency: 1,
  },
});
