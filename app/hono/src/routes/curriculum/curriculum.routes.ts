import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { APP_HONO } from "../../constant";
import { notFoundSchema } from "../../constant/schema";
import { insertCurriculumSchema, selectCurriculumSchema } from "../../database/schema/curriculum-schema";

const path = APP_HONO.ROUTES.CURRICULUM;
const tags = ["Curriculum"];

export const getCurriculumRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectCurriculumSchema),
      "The list of curriculum entries",
    ),
  },
});

export const postCurriculumRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertCurriculumSchema, "The curriculum entry to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCurriculumSchema,
      "The created curriculum entry",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertCurriculumSchema),
      "The validation error(s)",
    ),
  },
});

export const getOneCurriculumRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCurriculumSchema,
      "The requested curriculum entry",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The curriculum entry was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const patchCurriculumRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      insertCurriculumSchema,
      "The curriculum entry to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCurriculumSchema,
      "The updated curriculum entry",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The curriculum entry was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertCurriculumSchema),
      ),
      "The validation error(s)",
    ),
  },
});

export const deleteCurriculumRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The curriculum entry was deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The curriculum entry was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});
