/**
 * OpenAPI documentation configuration for Hono application
 *
 * This module sets up comprehensive API documentation using OpenAPI 3.0.3
 * specification and provides an interactive documentation interface using
 * Scalar. The configuration creates two endpoints:
 * - /doc: Raw OpenAPI JSON specification
 * - /scalar: Interactive API documentation UI
 */

import type { Schema } from "hono";

import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPIHono } from "../@types/open-api-hono";

import pkg from "../../package.json" with { type: "json" };

/**
 * Configure OpenAPI documentation for the Hono application
 *
 * This function adds OpenAPI documentation endpoints to the Hono app instance.
 * It sets up both the raw OpenAPI specification endpoint and an interactive
 * documentation UI powered by Scalar.
 *
 * @param app - The Hono application instance with OpenAPI support
 * @template S - The schema type for the Hono application
 */
export function configureOpenApi<S extends Schema>(app: AppOpenAPIHono<S>) {
  /**
   * Register the OpenAPI specification endpoint
   *
   * This creates a /doc endpoint that serves the raw OpenAPI 3.0.3 JSON
   * specification. The specification includes all registered routes with
   * their schemas, responses, and validation rules.
   */
  app.doc("/doc", {
    // OpenAPI specification version (latest stable version)
    // https://swagger.io/specification/v3/
    openapi: "3.0.3",
    info: {
      title: "OpenAPI", // API title shown in documentation
      version: pkg.version, // Version from package.json for consistency
    },
  });

  /**
   * Register the interactive API documentation endpoint
   *
   * This creates a /scalar endpoint that provides a beautiful, interactive
   * API documentation interface. Scalar is a modern alternative to Swagger UI
   * with better performance and user experience.
   *
   * Documentation: https://www.npmjs.com/package/@scalar/hono-api-reference
   * Dashboard: https://dashboard.scalar.com/
   */
  app.get("/scalar", Scalar({
    url: "/doc", // Points to our OpenAPI spec endpoint
    pageTitle: "Scalar", // Browser tab title
    hideModels: true, // Hide schema models section for cleaner UI
    theme: "kepler", // Dark theme with good contrast
    layout: "classic", // Traditional documentation layout
    defaultHttpClient: {
      clientKey: "fetch", // Use modern fetch API
      targetKey: "js", // Generate JavaScript examples
    },
  }));
}
