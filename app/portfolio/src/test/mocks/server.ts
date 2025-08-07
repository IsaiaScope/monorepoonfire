/**
 * Mock Service Worker (MSW) Server Setup
 *
 * This file configures MSW for intercepting HTTP requests in tests.
 * MSW allows us to mock API responses without relying on an actual server,
 * providing fast and reliable tests for components that fetch data.
 *
 * Usage:
 * - Import this server in test files to override API responses
 * - Use server.use() to add custom handlers for specific tests
 * - Handlers are automatically reset after each test
 */

import { setupServer } from "msw/node";

import { handlers } from "./handlers";

// Create MSW server with default handlers
// This server will intercept all network requests that match our handlers
export const server = setupServer(...handlers);
