import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "../../constant/schema";
import { insertWorkExperiencesSchema, selectWorkExperiencesSchema } from "../../database/schema/work-experience-schema";

const path = "/work-experience";
const tags = ["Work Experience"];

export const getWorkExperienceRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectWorkExperiencesSchema),
      "The list of work experiences",
    ),
  },
});

export const postWorkExperienceRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertWorkExperiencesSchema, "The work experience to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkExperiencesSchema,
      "The created work experience",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertWorkExperiencesSchema),
      "The validation error(s)",
    ),
  },
});

export const getOneWorkExperienceRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkExperiencesSchema,
      "The requested work experience",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The work experience was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const patchWorkExperienceRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      insertWorkExperiencesSchema,
      "The work experience to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkExperiencesSchema,
      "The updated work experience",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The work experience was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertWorkExperiencesSchema),
      ),
      "The validation error(s)",
    ),
  },
});
export const deleteWorkExperienceRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The work experience was deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The work experience was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});
