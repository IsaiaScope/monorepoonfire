/**
 * Type-safe RPC client factory for Hono application
 *
 * This module provides a factory function for creating type-safe HTTP clients
 * that can call the Hono API with full TypeScript support. It leverages Hono's
 * built-in RPC capabilities to generate clients that know about all available
 * routes, their parameters, and response types.
 */

import { hc } from "hono/client";

import type { Routes } from "../app";

/**
 * Internal client instance for type inference
 * This is used only to derive the correct TypeScript types
 * and is not exported or used directly
 */
const _honoClient = hc<Routes>("");
type HonoClient = typeof _honoClient;

/**
 * Create a type-safe Hono RPC client
 *
 * This factory function creates an RPC client that provides type-safe access
 * to all API routes defined in the application. The client automatically
 * knows about:
 * - Available endpoints and HTTP methods
 * - Request parameter types and validation
 * - Response types and structures
 * - Error response formats
 *
 * Usage example:
 * ```typescript
 * const client = honoClientWithType("http://localhost:3075");
 * const response = await client.api.projects.$get();
 * // response is fully typed based on the actual API definition
 * ```
 *
 * @param args - Arguments passed to the Hono client constructor (base URL, options, etc.)
 * @returns A type-safe client instance with all route types
 */
const honoClientWithType = (...args: Parameters<typeof hc>): HonoClient => hc<Routes>(...args);

export default honoClientWithType;
