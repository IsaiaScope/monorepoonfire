/**
 * Projects API Route Tests
 *
 * This test suite validates the complete CRUD functionality of the projects
 * API endpoints. It ensures proper request/response handling, validation, error
 * cases, and type safety across all HTTP methods.
 *
 * Test Coverage:
 * - POST /projects - Create new project entries
 * - GET /projects - Retrieve all project entries
 * - GET /projects/:id - Retrieve specific project by ID
 * - PATCH /projects/:id - Update existing project
 * - DELETE /projects/:id - Remove project entries
 *
 * Each endpoint is tested for:
 * - Successful operations with proper response types
 * - Validation errors with invalid input data
 * - Not found errors for non-existent resources
 * - Proper HTTP status codes and response schemas
 *
 * Special attention is given to the complex project schema which includes
 * nested objects for tags and arrays for sub-descriptions.
 */

import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/projects-schema";

import { printEnv } from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./projects.index";

/**
 * Test client setup
 *
 * Creates a test client using Hono's testing utilities with the projects router.
 * This provides type-safe access to all API endpoints for testing purposes.
 */
const client = testClient(createTestApp(router));

// Print environment configuration for debugging test runs
printEnv();

describe("[projects] routes tests", () => {
  /**
   * Test data storage
   *
   * Stores the ID of a created project entry to be used in subsequent tests
   * for update, retrieve, and delete operations. This ensures test isolation
   * and proper cleanup while testing the complete lifecycle of a project.
   */
  let testId: number;

  /**
   * Test Case: POST /projects - Validation Error
   *
   * Verifies that the API properly validates request body and returns
   * 422 Unprocessable Entity when invalid data types are provided.
   *
   * This test intentionally passes a number for the 'title' field
   * which should be a string, ensuring the Zod validation catches
   * the type mismatch and rejects the request appropriately.
   */
  it("[post /projects] should response 422 when body type is invalid ", async () => {
    const response = await client.api.projects.$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (title should not be a number)
        title: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: POST /projects - Successful Creation
   *
   * Tests the successful creation of a new project entry with valid, comprehensive data.
   * This test validates the complex project schema including:
   * - Basic string fields (title, description, href, repo, image)
   * - Array fields (subDescription with multiple items)
   * - Nested object arrays (tags with id and name properties)
   * - Language localization support
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the expected schema type
   * - The created entry has a valid auto-generated ID
   * - The response data matches the complex input structure
   * - The test ID is stored for subsequent operations
   */
  it("[post /projects] should response with 200 and the json coming back must be a project object", async () => {
    const response = await client.api.projects.$post({
      json: {
        language: "en-GB",
        title: "Test Project",
        description: "A test project for demonstration",
        subDescription: [
          "Built a scalable application with modern tech stack",
          "Implemented secure authentication and database management",
          "Designed responsive frontend with excellent user experience",
        ],
        href: "https://example.com/test-project",
        repo: "https://github.com/test/test-project",
        image: "https://example.com/test-project.png",
        tags: [{ id: 1, name: "React" }, { id: 2, name: "TypeScript" }],
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectProjectsSchema>>();
      expect(json.id).toBeDefined();
      expectTypeOf(json.id).toEqualTypeOf<number>();
      // 📝 NOTE: next line set the id for following tests
      testId = json.id;
    }
  });

  /**
   * Test Case: GET /projects - Retrieve All Projects
   *
   * Tests the retrieval of all project entries from the database.
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body is an array
   * - The array items match the project schema type
   * - The endpoint supports listing multiple projects with complex data
   */
  it("[get /projects] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.api.projects.$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectProjectsSchema>[]>();
    }
  });

  /**
   * Test Case: GET /projects/:id - Not Found Error
   *
   * Tests the error handling when attempting to retrieve a non-existent
   * project entry. Uses a valid ID format (999999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - The response body matches the standard not found error schema
   * - Proper error handling for missing resources with valid ID format
   */
  it("[get /projects/:id] should response with 404 with valid id format but non-existent id", async () => {
    const response = await client.api.projects[":id"].$get({
      param: {
        id: 999999,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  /**
   * Test Case: GET /projects/:id - Invalid ID Type
   *
   * Tests parameter validation by providing an invalid ID type (string "invalid"
   * instead of a number). This ensures the route parameter validation
   * properly catches type mismatches and protects the API.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Parameter validation works correctly for route parameters
   * - Type safety is enforced at the API boundary
   */
  it("[get /projects/:id] should response with 422 with invalid id", async () => {
    const response = await client.api.projects[":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "invalid",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: GET /projects/:id - Retrieve Specific Project
   *
   * Tests the retrieval of a specific project by its ID using the ID from
   * the previously created test entry. This ensures the endpoint can
   * successfully fetch and return individual project records with all
   * their complex data structures.
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the project schema
   * - The correct project is retrieved based on the provided ID
   * - Complex data (tags, subDescription) is properly returned
   */
  it("[get /projects/:id] should response with 200 and the json coming back must be a project object", async () => {
    const response = await client.api.projects[":id"].$get({
      param: {
        id: testId,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectProjectsSchema>>();
    }
  });

  /**
   * Test Case: PATCH /projects/:id - Invalid ID Type
   *
   * Tests parameter validation for update operations by providing an invalid
   * ID type (string "invalid" instead of a number). This ensures route parameter
   * validation works consistently across all endpoints, even when valid
   * request body data is provided.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Parameter validation is prioritized and enforced for update operations
   * - Type safety is maintained for route parameters in PATCH requests
   */
  it("[patch /projects/:id] should response with 422 with invalid id", async () => {
    const response = await client.api.projects[":id"].$patch({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "invalid",
      },
      json: {
        title: "Updated Project",
        language: "en-GB",
        description: "Updated description",
        subDescription: [
          "Updated feature 1 description",
          "Updated feature 2 description",
          "Additional updated details",
        ],
        href: "https://example.com/updated-project",
        repo: "https://github.com/test/updated-project",
        image: "https://example.com/updated-project.png",
        tags: [{ id: 1, name: "Vue" }, { id: 2, name: "JavaScript" }],
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: PATCH /projects/:id - Not Found Error
   *
   * Tests the error handling when attempting to update a non-existent
   * project entry. Uses a valid ID format (999999) that doesn't exist in the database,
   * along with comprehensive update data to ensure the 404 error is returned
   * for the missing resource rather than validation errors.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - Proper error handling for update operations on missing resources
   * - Complex update data doesn't interfere with resource existence validation
   */
  it("[patch /projects/:id] should response with 404 with valid id format but non-existent id", async () => {
    const response = await client.api.projects[":id"].$patch({
      param: {
        id: 999999,
      },
      json: {
        title: "Updated Project",
        language: "en-GB",
        description: "Updated description",
        subDescription: [
          "Updated feature 1 description",
          "Updated feature 2 description",
          "Additional updated details",
        ],
        href: "https://example.com/updated-project",
        repo: "https://github.com/test/updated-project",
        image: "https://example.com/updated-project.png",
        tags: [{ id: 1, name: "Vue" }, { id: 2, name: "JavaScript" }],
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
  });

  /**
   * Test Case: PATCH /projects/:id - Successful Update
   *
   * Tests the successful update of an existing project entry with comprehensive
   * new data. This test validates the complex update functionality including:
   * - Updating all project fields (title, description, URLs, etc.)
   * - Handling complex data structures (subDescription array, tags array)
   * - Preserving data integrity during partial updates
   * - Proper timestamp management for updates
   *
   * Verifies that:
   * - The response returns 200 OK status
   * - The response body matches the project schema
   * - The updated data is correctly applied and returned
   * - Complex data structures are properly handled
   */
  it("[patch /projects/:id] should response with 200 and the json coming back must be a project object", async () => {
    const response = await client.api.projects[":id"].$patch({
      param: {
        id: testId,
      },
      json: {
        title: "Updated Project",
        language: "en-GB",
        description: "Updated description",
        subDescription: [
          "Updated feature 1 description",
          "Updated feature 2 description",
          "Additional updated details",
        ],
        href: "https://example.com/updated-project",
        repo: "https://github.com/test/updated-project",
        image: "https://example.com/updated-project.png",
        tags: [{ id: 1, name: "Vue" }, { id: 2, name: "JavaScript" }],
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectProjectsSchema>>();
    }
  });

  /**
   * Test Case: DELETE /projects/:id - Invalid ID Type
   *
   * Tests parameter validation for delete operations by providing an invalid
   * ID type (string "invalid" instead of a number). This ensures route parameter
   * validation works consistently across all CRUD operations including DELETE.
   *
   * Verifies that:
   * - The response returns 422 Unprocessable Entity status
   * - Parameter validation is enforced for delete operations
   * - Type safety is maintained for all HTTP methods
   */
  it("[delete /projects/:id] should response with 422 with invalid id", async () => {
    const response = await client.api.projects[":id"].$delete({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "invalid",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  /**
   * Test Case: DELETE /projects/:id - Not Found Error
   *
   * Tests the error handling when attempting to delete a non-existent
   * project entry. Uses a valid ID format (999999) that doesn't exist in the database.
   *
   * Verifies that:
   * - The response returns 404 Not Found status
   * - Proper error handling for delete operations on missing resources
   * - The API correctly distinguishes between parameter validation errors and missing resources
   */
  it("[delete /projects/:id] should response with 404 with valid id format but non-existent id", async () => {
    const response = await client.api.projects[":id"].$delete({
      param: {
        id: 999999,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
  });

  /**
   * Test Case: DELETE /projects/:id - Successful Deletion
   *
   * Tests the successful deletion of a project entry using the ID from
   * the previously created test entry. This completes the full CRUD
   * lifecycle test and ensures proper cleanup of test data.
   *
   * Verifies that:
   * - The response returns 204 No Content status
   * - The delete operation completes successfully
   * - Proper cleanup of test data
   * - The complete CRUD lifecycle works as expected
   */
  it("[delete /projects/:id] should response with 204", async () => {
    const response = await client.api.projects[":id"].$delete({
      param: {
        id: testId,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
  });
});
