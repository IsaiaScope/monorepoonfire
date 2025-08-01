import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/projects-schema";

import { printEnv } from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./projects.index";

const client = testClient(createTestApp(router));

printEnv();

describe("[projects] routes tests", () => {
  let testId: number;

  it("[post /projects] should response 422 when body type is invalid ", async () => {
    const response = await client.api.projects.$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (title should not be a number)
        title: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

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

  it("[get /projects] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.api.projects.$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectProjectsSchema>[]>();
    }
  });

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

  it("[get /projects/:id] should response with 422 with invalid id", async () => {
    const response = await client.api.projects[":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "invalid",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

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

  it("[delete /projects/:id] should response with 422 with invalid id", async () => {
    const response = await client.api.projects[":id"].$delete({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "invalid",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[delete /projects/:id] should response with 404 with valid id format but non-existent id", async () => {
    const response = await client.api.projects[":id"].$delete({
      param: {
        id: 999999,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
  });

  it("[delete /projects/:id] should response with 204", async () => {
    const response = await client.api.projects[":id"].$delete({
      param: {
        id: testId,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
  });
});
