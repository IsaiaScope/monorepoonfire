// =============================================================================
// RPC CLIENT CONFIGURATION - Hono API Client Setup
// =============================================================================
// This file configures the RPC client for type-safe API communication between
// the portfolio frontend and the Hono backend server. It creates a typed client
// that provides full TypeScript inference for API routes, request/response types,
// and automatic error handling.

// Import the typed Hono client factory from the backend application
// This import provides the complete API type definitions and route configurations
import honoClientWithType from "@app/hono/rpc";

import { env } from "../environment/env";

const honoClient = honoClientWithType(
  import.meta.env.PROD ? window.location.origin : env.VITE_BASE_URL,
);

// Export the configured client for use throughout the application
// This client can be imported in other files to make type-safe API calls
// Example usage: honoClient.api.projects.$get()
export default honoClient;
