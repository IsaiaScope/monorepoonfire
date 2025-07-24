import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/work-experience-schema";

import { printEnv } from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./work-experience.index";

const client = testClient(createTestApp(router));

printEnv();

describe("[work-experience] routes tests", () => {
  let testId: number;

  it("[post /work-experience] should response 422 when body type is invalid ", async () => {
    const response = await client.api["work-experience"].$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (role should not be a number)
        role: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

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

  it("[get /work-experience] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.api["work-experience"].$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectWorkExperiencesSchema>[]>();
    }
  });

  it("[get /work-experience/:id] should response with 200 and the json coming back must be a work experience object", async () => {
    const response = await client.api["work-experience"][":id"].$get({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectWorkExperiencesSchema>>();
    }
  });

  it("[get /work-experience/:id] should response with 404 when work experience not found", async () => {
    const response = await client.api["work-experience"][":id"].$get({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  it("[get /work-experience/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api["work-experience"][":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

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

  it("[delete /work-experience/:id] should response with 204", async () => {
    const response = await client.api["work-experience"][":id"].$delete({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
  });

  it("[delete /work-experience/:id] should response with 404 when work experience not found", async () => {
    const response = await client.api["work-experience"][":id"].$delete({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

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
