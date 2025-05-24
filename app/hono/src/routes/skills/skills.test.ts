import type z from "zod";

import { testClient } from "hono/testing";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { describe, expect, expectTypeOf, it } from "vitest";

import type { notFoundSchema } from "../../constant/schema";
import type * as schema from "../../database/schema/skills-schema";

import env from "../../environment/env";
import { createTestApp } from "../../library/create-app";
import router from "./skills.index";

const client = testClient(createTestApp(router));

console.warn("[TEST] ENV", env);

describe("[skills] routes tests", () => {
  let testId: number;

  it("[post /skills] should response 422 when body type is invalid ", async () => {
    const response = await client.skills.$post({
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (name should not be a number)
        name: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[post /skills] should response with 200 and the json coming back must be an skill object", async () => {
    const response = await client.skills.$post({
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

  it("[get /skills] should response with 200 and the json coming back must be an array", async () => {
    const response = await client.skills.$get();
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectSkillsSchema>[]>();
      expect(json.length).toBe(1);
    }
  });

  it("[get /skills/:id] should response with 200 and the json coming back must be an skill object", async () => {
    const response = await client.skills[":id"].$get({ param: { id: testId } });
    expect(response.status).toBe(HttpStatusCodes.OK);
    if (response.status === HttpStatusCodes.OK) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof schema.selectSkillsSchema>>();
    }
  });

  it("[get /skills/:id] should response with 404 when skill not found", async () => {
    const response = await client.skills[":id"].$get({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  it("[get /skills/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.skills[":id"].$get({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[patch /skills/:id] should response with 200 and the json coming back must be an skill object", async () => {
    const response = await client.skills[":id"].$patch({
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

  it("[patch /skills/:id] should response with 404 when skill not found", async () => {
    const response = await client.skills[":id"].$patch({
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

  it("[patch /skills/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.skills[":id"].$patch({
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

  it("[patch /skills/:id] should response with 422 when body type is invalid", async () => {
    const response = await client.skills[":id"].$patch({
      param: { id: testId },
      json: {
        // @ts-expect-error: intentionally passing wrong type to test validation (name should not be a number)
        name: 1234,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });

  it("[delete /skills/:id] should response with 204", async () => {
    const response = await client.skills[":id"].$delete({ param: { id: testId } });
    expect(response.status).toBe(204);
  });

  it("[delete /skills/:id] should response with 404 when skill not found", async () => {
    const response = await client.skills[":id"].$delete({ param: { id: 9999 } });
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    if (response.status === HttpStatusCodes.NOT_FOUND) {
      const json = await response.json();
      expectTypeOf(json).toEqualTypeOf<z.infer<typeof notFoundSchema>>();
    }
  });

  it("[delete /skills/:id] should response with 422 when id type is invalid", async () => {
    const response = await client.skills[":id"].$delete({
      param: {
        // @ts-expect-error: intentionally passing wrong type to test validation (id should be a number)
        id: "wat",
      },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  });
});
