/**
 * Work Experience API Route Tests
 *
 * This test suite validates the complete CRUD functionality of the work experience
 * API endpoints. It ensures proper request/response handling, validation, error
 * cases, and type safety across all HTTP methods.
 *
 * Test Coverage:
 * - POST /work-experience - Create new work experience entries
 * - GET /work-experience - Retrieve all work experience entries
 * - GET /work-experience/:id - Retrieve specific work experience by ID
 * - PATCH /work-experience/:id - Update existing work experience
 * - DELETE /work-experience/:id - Remove work experience entries
 *
 * Each endpoint is tested for:
 * - Successful operations with proper response types
 * - Validation errors with invalid input data
 * - Not found errors for non-existent resources
 * - Proper HTTP status codes and response schemas
 */

import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/work-experience-schema";

import { printEnv } from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./work-experience.index";

/**
 * Test client setup
 *
 * Creates a test client using Hono's testing utilities with the work experience router.
 * This provides type-safe access to all API endpoints for testing purposes.
 */
const client = testClient(createTestApp(router));

// Print environment configuration for debugging test runs
printEnv();

describe("[work-experience] routes tests", () => {
  /**
   * Test data storage
   *
   * Stores the ID of a created work experience entry to be used
   * in subsequent tests for update, retrieve, and delete operations.
   * This ensures test isolation and proper cleanup.
   */
  let testId: number;

  /**
   * Test Case: POST /work-experience - Validation Error
   *
   * Verifies that the API properly validates request body and returns
   * 422 Unprocessable Entity when invalid data types are provided.
   *
   * This test intentionally passes a number for the 'role' field
   * which should be a string, ensuring the Zod validation catches
   * the type mismatch.
   */
  it("[post /work-experience] should response 422 when body type is invalid ", async () => {
    const response = await client.api["work-experience"].$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (role should not be a number)
        role: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: POST /work-experience - Successful Creation
   *
   * Tests the successful creation of a new work experience entry with valid data.
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the expected schema type
   * - The created entry has a valid ID
   * - The response data matches the input data
   * - The test ID is stored for subsequent tests
   */
  it("[post /work-experience] should response with 200 and the json coming back must be a work experience object", async () => {
    const response = await client.api["work-experience"].$post({
      json: {
        language: "en-GB",
        role: "Software Engineer",
        company: "Test Company",
        location: "San Francisco, CA",
        longDescription: "Worked on various projects involving web development and cloud computing.",
        shortDescription: "Developed web applications and managed cloud infrastructure.",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectWorkExperiencesSchema>>();
      expect(json.id).toBeDefined();
      expectTypeOf(json.id).toEqualTypeOf<number>();
      // 📝 NOTE: next line set the id for following tests
      testId = json.id;
      expect(json.role).toBe("Software Engineer");
      expect(json.company).toBe("Test Company");
    }
  });

  /**
   * Test Case: GET /work-experience - Retrieve All Entries
   *
   * Tests the retrieval of all work experience entries from the database.
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body is an array
   * - The array items match the work experience schema type
   * - The endpoint supports listing multiple entries
   */
  it("[get /work-experience] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.api["work-experience"].$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectWorkExperiencesSchema>[]>();
    }
  });

  /**
   * Test Case: GET /work-experience/:id - Retrieve Specific Entry
   *
   * Tests the retrieval of a specific work experience entry by ID.
   * Uses the ID from the previously created test entry to ensure
   * the endpoint can successfully fetch and return individual records.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the work experience schema
   * - The correct entry is retrieved based on the provided ID
   */
  it("[get /work-experience/:id] should response with 200 and the json coming back must be a work experience object", async () => {
    const response = await client.api["work-experience"][":id"].$get({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectWorkExperiencesSchema>>();
    }
  });

  /**
   * Test Case: GET /work-experience/:id - Not Found Error
   *
   * Tests the error handling when attempting to retrieve a non-existent
   * work experience entry. Uses an ID (9999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for invalid resource requests
   */
  it("[get /work-experience/:id] should response with 404 when work experience not found", async () => {
    const response = await client.api["work-experience"][":id"].$get({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: GET /work-experience/:id - Invalid ID Type
   *
   * Tests parameter validation by providing an invalid ID type (string "wat"
   * instead of a number). This ensures the route parameter validation
   * properly catches type mismatches.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Parameter validation works correctly for route parameters
   * - Type safety is enforced at the API boundary
   */
  it("[get /work-experience/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api["work-experience"][":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: PATCH /work-experience/:id - Successful Update
   *
   * Tests the successful update of an existing work experience entry.
   * Uses the ID from the previously created test entry and provides
   * updated data to verify the patch operation works correctly.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the work experience schema
   * - The updated data is correctly applied
   * - The entry can be successfully modified
   */
  it("[patch /work-experience/:id] should response with 200 and the json coming back must be a work experience object", async () => {
    const response = await client.api["work-experience"][":id"].$patch({
      param: { id: testId },
      json: {
        language: "en-GB",
        role: "Senior Software Engineer",
        company: "Updated Company",
        location: "New York, NY",
        longDescription: "Updated long description with more details about responsibilities.",
        shortDescription: "Updated short description.",
        startDate: "2022-01-01",
        endDate: "2024-01-01",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectWorkExperiencesSchema>>();
      expect(json.role).toBe("Senior Software Engineer");
      expect(json.company).toBe("Updated Company");
    }
  });

  /**
   * Test Case: PATCH /work-experience/:id - Not Found Error
   *
   * Tests the error handling when attempting to update a non-existent
   * work experience entry. Uses an ID (9999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for update operations on missing resources
   */
  it("[patch /work-experience/:id] should response with 404 when work experience not found", async () => {
    const response = await client.api["work-experience"][":id"].$patch({
      param: { id: 9999 },
      json: {
        language: "en-GB",
        role: "Updated Role",
        company: "Updated Company",
        location: "Updated Location",
        longDescription: "Updated long description.",
        shortDescription: "Updated short description.",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: PATCH /work-experience/:id - Invalid ID Type
   *
   * Tests parameter validation for update operations by providing an invalid
   * ID type (string "wat" instead of a number). This ensures route parameter
   * validation works consistently across all endpoints.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Parameter validation is enforced for update operations
   * - Type safety is maintained for route parameters
   */
  it("[patch /work-experience/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api["work-experience"][":id"].$patch({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
      json: {
        language: "en-GB",
        role: "Updated Role",
        company: "Updated Company",
        location: "Updated Location",
        longDescription: "Updated long description.",
        shortDescription: "Updated short description.",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: PATCH /work-experience/:id - Invalid Body Type
   *
   * Tests request body validation for update operations by providing invalid
   * data types. This ensures that validation works consistently for both
   * create and update operations.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Request body validation is enforced for update operations
   * - Type safety is maintained for request bodies
   */
  it("[patch /work-experience/:id] should response with 422 when body type is invalid", async () => {
    const response = await client.api["work-experience"][":id"].$patch({
      param: { id: testId },
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (role should not be a number)
        role: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: DELETE /work-experience/:id - Successful Deletion
   *
   * Tests the successful deletion of a work experience entry.
   * Uses the ID from the previously created test entry to ensure
   * the endpoint can successfully remove records from the database.
   *
   * Verifies that:
   * - The response returns 204 No Content status
   * - The delete operation completes successfully
   * - Proper cleanup of test data
   */
  it("[delete /work-experience/:id] should response with 204", async () => {
    const response = await client.api["work-experience"][":id"].$delete({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
  });

  /**
   * Test Case: DELETE /work-experience/:id - Not Found Error
   *
   * Tests the error handling when attempting to delete a non-existent
   * work experience entry. Uses an ID (9999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for delete operations on missing resources
   */
  it("[delete /work-experience/:id] should response with 404 when work experience not found", async () => {
    const response = await client.api["work-experience"][":id"].$delete({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: DELETE /work-experience/:id - Invalid ID Type
   *
   * Tests parameter validation for delete operations by providing an invalid
   * ID type (string "wat" instead of a number). This ensures route parameter
   * validation works consistently across all CRUD operations.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Parameter validation is enforced for delete operations
   * - Type safety is maintained for all HTTP methods
   */
  it("[delete /work-experience/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api["work-experience"][":id"].$delete({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });
});
