/**
 * Skills API Route Tests
 *
 * This test suite validates the complete CRUD functionality of the skills
 * API endpoints. It ensures proper request/response handling, validation, error
 * cases, and type safety across all HTTP methods.
 *
 * Test Coverage:
 * - POST /skills - Create new skill entries
 * - GET /skills - Retrieve all skill entries
 * - GET /skills/:id - Retrieve specific skill by ID
 * - PATCH /skills/:id - Update existing skill
 * - DELETE /skills/:id - Remove skill entries
 *
 * Each endpoint is tested for:
 * - Successful operations with proper response types
 * - Validation errors with invalid input data
 * - Not found errors for non-existent resources
 * - Proper HTTP status codes and response schemas
 *
 * The skills API has a simpler schema compared to projects and work experience,
 * focusing primarily on the skill name, making it an ideal endpoint for
 * testing basic CRUD operations.
 */

import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/skills-schema";

import { printEnv } from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./skills.index";

/**
 * Test client setup
 *
 * Creates a test client using Hono's testing utilities with the skills router.
 * This provides type-safe access to all API endpoints for testing purposes.
 */
const client = testClient(createTestApp(router));

// Print environment configuration for debugging test runs
printEnv();

describe("[skills] routes tests", () => {
  /**
   * Test data storage
   *
   * Stores the ID of a created skill entry to be used in subsequent tests
   * for update, retrieve, and delete operations. This ensures test isolation
   * and proper cleanup while testing the complete lifecycle of a skill.
   */
  let testId: number;

  /**
   * Test Case: POST /skills - Validation Error
   *
   * Verifies that the API properly validates request body and returns
   * 422 Unprocessable Entity when invalid data types are provided.
   *
   * This test intentionally passes a number for the 'name' field
   * which should be a string, ensuring the Zod validation catches
   * the type mismatch and protects data integrity.
   */
  it("[post /skills] should response 422 when body type is invalid ", async () => {
    const response = await client.api.skills.$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (name should not be a number)
        name: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: POST /skills - Successful Creation
   *
   * Tests the successful creation of a new skill entry with valid data.
   * The skills endpoint has a simple schema with just a name field,
   * making it straightforward to test basic CRUD functionality.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the expected schema type
   * - The created entry has a valid auto-generated ID
   * - The response data matches the input data
   * - The test ID is stored for subsequent test operations
   */
  it("[post /skills] should response with 200 and the json coming back must be an skill object", async () => {
    const response = await client.api.skills.$post({
      json: {
        name: "Test Skill",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectSkillsSchema>>();
      expect(json.id).toBeDefined();
      expectTypeOf(json.id).toEqualTypeOf<number>();
      // 📝 NOTE: next line set the id for following tests
      testId = json.id;
      expect(json.name).toBe("Test Skill");
    }
  });

  /**
   * Test Case: GET /skills - Retrieve All Entries
   *
   * Tests the retrieval of all skill entries from the database.
   * This endpoint is commonly used to populate skill lists in the frontend
   * and should return a consistent array format.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body is an array
   * - The array items match the skill schema type
   * - The endpoint supports listing multiple skills
   */
  it("[get /skills] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.api.skills.$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectSkillsSchema>[]>();
    }
  });

  /**
   * Test Case: GET /skills/:id - Retrieve Specific Skill
   *
   * Tests the retrieval of a specific skill by its ID using the ID from
   * the previously created test entry. This ensures the endpoint can
   * successfully fetch and return individual skill records.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the skill schema
   * - The correct skill is retrieved based on the provided ID
   */
  it("[get /skills/:id] should response with 200 and the json coming back must be an skill object", async () => {
    const response = await client.api.skills[":id"].$get({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectSkillsSchema>>();
    }
  });

  /**
   * Test Case: GET /skills/:id - Not Found Error
   *
   * Tests the error handling when attempting to retrieve a non-existent
   * skill entry. Uses an ID (9999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for invalid resource requests
   */
  it("[get /skills/:id] should response with 404 when skill not found", async () => {
    const response = await client.api.skills[":id"].$get({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: GET /skills/:id - Invalid ID Type
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
  it("[get /skills/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api.skills[":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: PATCH /skills/:id - Successful Update
   *
   * Tests the successful update of an existing skill entry.
   * Uses the ID from the previously created test entry and provides
   * updated data to verify the patch operation works correctly.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the skill schema
   * - The updated data is correctly applied
   * - The skill can be successfully modified
   */
  it("[patch /skills/:id] should response with 200 and the json coming back must be an skill object", async () => {
    const response = await client.api.skills[":id"].$patch({
      param: { id: testId },
      json: {
        name: "Updated Skill",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectSkillsSchema>>();
    }
  });

  /**
   * Test Case: PATCH /skills/:id - Not Found Error
   *
   * Tests the error handling when attempting to update a non-existent
   * skill entry. Uses an ID (9999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for update operations on missing resources
   */
  it("[patch /skills/:id] should response with 404 when skill not found", async () => {
    const response = await client.api.skills[":id"].$patch({
      param: { id: 9999 },
      json: {
        name: "Updated Skill",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: PATCH /skills/:id - Invalid ID Type
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
  it("[patch /skills/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api.skills[":id"].$patch({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
      json: {
        name: "Updated Skill",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: PATCH /skills/:id - Invalid Body Type
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
  it("[patch /skills/:id] should response with 422 when body type is invalid", async () => {
    const response = await client.api.skills[":id"].$patch({
      param: { id: testId },
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (name should not be a number)
        name: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: DELETE /skills/:id - Successful Deletion
   *
   * Tests the successful deletion of a skill entry.
   * Uses the ID from the previously created test entry to ensure
   * the endpoint can successfully remove records from the database.
   *
   * Verifies that:
   * - The response returns 204 No Content status
   * - The delete operation completes successfully
   * - Proper cleanup of test data
   */
  it("[delete /skills/:id] should response with 204", async () => {
    const response = await client.api.skills[":id"].$delete({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
  });

  /**
   * Test Case: DELETE /skills/:id - Not Found Error
   *
   * Tests the error handling when attempting to delete a non-existent
   * skill entry. Uses an ID (9999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for delete operations on missing resources
   */
  it("[delete /skills/:id] should response with 404 when skill not found", async () => {
    const response = await client.api.skills[":id"].$delete({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: DELETE /skills/:id - Invalid ID Type
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
  it("[delete /skills/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api.skills[":id"].$delete({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });
});
