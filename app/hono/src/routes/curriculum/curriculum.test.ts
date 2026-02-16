import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/curriculum-schema";

import { printEnv } from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./curriculum.index";

const client = testClient(createTestApp(router));

printEnv();

describe("[curriculum] routes tests", () => {
  let testId: number;

  it("[post /curriculum] should response 422 when body type is invalid ", async () => {
    const response = await client.api.curriculum.$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (url should not be a number)
        url: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[post /curriculum] should response with 200 and the json coming back must be a curriculum object", async () => {
    const response = await client.api.curriculum.$post({
      json: {
        url: "https://example.com/cv.pdf",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectCurriculumSchema>>();
      expect(json.id).toBeDefined();
      expectTypeOf(json.id).toEqualTypeOf<number>();
      // 📝 NOTE: next line set the id for following tests
      testId = json.id;
      expect(json.url).toBe("https://example.com/cv.pdf");
    }
  });

  it("[get /curriculum] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.api.curriculum.$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectCurriculumSchema>[]>();
    }
  });

  it("[get /curriculum/:id] should response with 200 and the json coming back must be a curriculum object", async () => {
    const response = await client.api.curriculum[":id"].$get({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectCurriculumSchema>>();
    }
  });

  it("[get /curriculum/:id] should response with 404 when curriculum not found", async () => {
    const response = await client.api.curriculum[":id"].$get({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  it("[get /curriculum/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api.curriculum[":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[patch /curriculum/:id] should response with 200 and the json coming back must be a curriculum object", async () => {
    const response = await client.api.curriculum[":id"].$patch({
      param: { id: testId },
      json: {
        url: "https://example.com/updated-cv.pdf",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectCurriculumSchema>>();
    }
  });

  it("[patch /curriculum/:id] should response with 404 when curriculum not found", async () => {
    const response = await client.api.curriculum[":id"].$patch({
      param: { id: 9999 },
      json: {
        url: "https://example.com/updated-cv.pdf",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  it("[patch /curriculum/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api.curriculum[":id"].$patch({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
      json: {
        url: "https://example.com/updated-cv.pdf",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[patch /curriculum/:id] should response with 422 when body type is invalid", async () => {
    const response = await client.api.curriculum[":id"].$patch({
      param: { id: testId },
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (url should not be a number)
        url: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[delete /curriculum/:id] should response with 204", async () => {
    const response = await client.api.curriculum[":id"].$delete({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
  });

  it("[delete /curriculum/:id] should response with 404 when curriculum not found", async () => {
    const response = await client.api.curriculum[":id"].$delete({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  it("[delete /curriculum/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.api.curriculum[":id"].$delete({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });
});
