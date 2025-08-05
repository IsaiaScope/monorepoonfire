/**
 * Common schema definitions for API responses
 *
 * This file contains reusable Zod schemas that are used across multiple
 * routes for consistent API response structures. Using the 'stoker' library
 * provides standardized OpenAPI-compatible schemas.
 */

import * as HttpStatusPhases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

/**
 * Standard 404 Not Found response schema
 *
 * This schema defines the structure for 404 error responses across all API endpoints.
 * It uses the stoker library to create a consistent message object with the
 * appropriate HTTP status phrase.
 *
 * Response structure: { message: "Not Found" }
 */
export const notFoundSchema = createMessageObjectSchema(HttpStatusPhases.NOT_FOUND);
