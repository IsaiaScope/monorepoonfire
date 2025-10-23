/**
 * Hono application factory functions
 *
 * This module provides factory functions for creating Hono application instances
 * with different configurations. It sets up the core middleware stack including
 * logging, CORS, error handling, and request tracking.
 */

import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "hono-pino";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import pino from "pino";
import pretty from "pino-pretty";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { AppEnv, AppOpenAPIHono } from "../@types/open-api-hono";

import { env } from "../environment/env";
import { redirectHost } from "../middleware/redirect-host";

/**
 * Create a base Hono application with OpenAPI support
 *
 * This function creates a new OpenAPIHono instance with minimal configuration.
 * It's used as the foundation for both development and test applications.
 *
 * @template S - The schema type for route definitions
 * @returns A new OpenAPIHono instance with basic configuration
 */
// eslint-disable-next-line ts/no-empty-object-type
export function createApp<S extends Schema = {}>() {
  return new OpenAPIHono<AppEnv, S>({
    /**
     * strict: false allows the app to serve routes with or without trailing slashes
     * For example, both /api/v1/ and /api/v1 will be served the same way
     * This provides more flexible routing for API consumers
     */
    strict: false,

    /**
     * defaultHook provides automatic validation and error handling for OpenAPI routes
     * It ensures request/response validation happens automatically based on schemas
     */
    defaultHook,
  });
}

/**
 * Initialize a fully configured Hono application with middleware stack
 *
 * This function creates a production-ready Hono application with all necessary
 * middleware configured. It sets up logging, CORS, error handling, and other
 * essential features for a robust API server.
 *
 * @returns A fully configured Hono application ready for route registration
 */
export function initApp() {
  // Create the base application
  const app = createApp();

  app.use(
    compress(), // Enable response compression for better performance
  );
  /**
   * Serve a fire emoji (🔥) as favicon
   * Provides a simple favicon without needing a static file
   */
  app.use(serveEmojiFavicon("🔥"));

  /**
   * Configure Cross-Origin Resource Sharing (CORS)
   *
   * Since redirect middleware now skips API calls, we can use simple CORS configuration.
   * CORS_ORIGINS should include all domains that need access to the API.
   */
  const getCorsOrigins = () => {
    const corsOrigins = env.CORS_ORIGINS;

    // If CORS_ORIGINS is "*", allow all origins (development)
    if (corsOrigins === "*") {
      return "*";
    }

    // Return array of allowed origins
    return corsOrigins.split(",").map(origin => origin.trim()).filter(origin => origin);
  };

  app.use(
    cors({
      origin: getCorsOrigins(), // Environment-specific origins
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // HTTP methods to allow
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Headers that can be sent
      credentials: true, // Allow cookies/auth headers
      maxAge: 86400, // Cache preflight for 24 hours
    }),
  );

  /**
   * Add request tracking and logging middleware
   *
   * This chain of middleware provides:
   * 1. Unique request IDs for tracing requests through logs
   * 2. Structured logging with Pino for better observability
   */
  app.use(
    // Add unique request ID to each request for tracing
    // Documentation: https://hono.dev/docs/middleware/builtin/request-id
    requestId(),
  ).use(
    // Structured logging with Pino
    // Documentation: https://www.npmjs.com/package/hono-pino?activeTab=code
    pinoLogger({
      /**
       * Configure Pino logger
       * - Uses LOG_LEVEL from environment variables (defaults to "info")
       * - In production: Uses JSON logging for machine parsing
       * - In development: Uses pretty printing for human readability
       *
       * Pino docs: https://www.npmjs.com/package/pino
       * Pretty printer: https://github.com/pinojs/pino-pretty
       */
      pino: pino({
        level: env.LOG_LEVEL || "info", // Log level from environment
      }, env.ENV === "production" ? undefined : pretty()), // Pretty print in development
    }),
  );

  /**
   * Additional middleware for SEO, security, and performance
   *
   * These middleware are applied after the base middleware stack:
   * 1. redirectHost - SEO critical: redirects Railway domain to canonical domain
   * 2. secureHeaders - Security: adds security headers (CSP, HSTS, etc.)
   * 3. timing - Performance: adds Server-Timing headers for debugging
   */

  // SEO Critical: Redirect Railway hosting domain to canonical domain
  // This ensures www.isaiariva.com appears in search results, not Railway subdomain
  // Uses env.RAILWAY_HOST_SNIPPET and env.CANONICAL_HOST from environment config
  app.use("*", redirectHost);

  // Security: Add security headers to all responses
  app.use("*", secureHeaders());

  // Performance: Add timing information for debugging
  // Helps identify slow API endpoints and middleware
  app.use("*", timing());

  /**
   * Configure global error handlers
   *
   * These handlers provide consistent error responses across all routes:
   * - notFound: Handles 404 errors with standard format
   * - onError: Handles unhandled exceptions with proper logging and response format
   */
  app.notFound(notFound); // Standard 404 handler from stoker
  app.onError(onError); // Standard error handler from stoker

  return app;
}

/**
 * Create a test application instance
 *
 * This function creates a test-specific Hono application by combining the
 * full middleware stack with a specific router. It's used in unit tests
 * to create isolated application instances for testing individual routes.
 *
 * @template S - The schema type for the router
 * @param router - The router to mount on the test application
 * @returns A test application with the router mounted at the root path
 */
export function createTestApp<S extends Schema>(router: AppOpenAPIHono<S>) {
  return initApp().route("/", router);
}
