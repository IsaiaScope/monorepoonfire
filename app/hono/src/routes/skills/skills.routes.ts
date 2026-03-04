import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { APP_HONO } from "../../constant";
import { notFoundSchema } from "../../constant/schema";
import { insertSkillsSchema, selectSkillsSchema } from "../../database/schema/skills-schema";

const path = APP_HONO.ROUTES.SKILLS;
const tags = ["Skills"];

export const getSkillsRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectSkillsSchema),
      "The list of skills",
    ),
  },
});

export const postSkillsRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertSkillsSchema, "The skill to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSkillsSchema,
      "The created skill",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSkillsSchema),
      "The validation error(s)",
    ),
  },
});

export const getOneSkillsRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSkillsSchema,
      "The requested skill",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The skill was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const patchSkillsRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      insertSkillsSchema,
      "The skill to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSkillsSchema,
      "The updated skill",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The skill was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertSkillsSchema),
      ),
      "The validation error(s)",
    ),
  },
});

export const deleteSkillsRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The skill was deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The skill was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});
