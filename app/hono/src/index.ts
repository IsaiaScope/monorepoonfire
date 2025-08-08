/**
 * Main server entry point for the Hono backend application
 *
 * This file initializes and starts the HTTP server using the Hono framework
 * with Node.js server adapter. It configures the server port and starts
 * listening for incoming requests.
 */

import { serve } from "@hono/node-server";

import app from "./app";
import env, { printEnv } from "./environment/env";

// Extract the configured port from environment variables
// This allows for flexible deployment across different environments
const port = env.PORT;

/**
 * Start the HTTP server using Hono's Node.js adapter
 *
 * The serve function creates an HTTP server that:
 * - Uses the Hono app's fetch handler for request processing
 * - Listens on the configured port
 * - Provides server info callback for startup logging
 */
serve({
  fetch: app.fetch, // Hono app's fetch handler processes all requests
  port: +port, // Convert port to number (+ operator for type coercion)
}, (info) => {
  // Log server startup information
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`);
});

// Print environment configuration for debugging and verification
printEnv();
