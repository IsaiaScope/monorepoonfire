import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "../../constant/schema";
import { insertProjectsSchema, selectProjectsSchema } from "../../database/schema/projects-schema";

const path = "/projects";
const tags = ["Projects"];

export const getProjectsRoute = createRoute({
  path,
  tags,
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectProjectsSchema),
      "The list of projects",
    ),
  },
});

export const postProjectRoute = createRoute({
  path,
  tags,
  method: "post",
  request: {
    body: jsonContentRequired(insertProjectsSchema, "The project to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProjectsSchema,
      "The created project",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertProjectsSchema),
      "The validation error(s)",
    ),
  },
});

export const getOneProjectRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProjectsSchema,
      "The requested project",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The project was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const patchProjectRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(insertProjectsSchema, "The project updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProjectsSchema,
      "The updated project",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The project was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(
        createErrorSchema(insertProjectsSchema),
      ),
      "The validation error(s)",
    ),
  },
});

export const deleteProjectRoute = createRoute({
  path: `${path}/{id}`,
  tags,
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "The project was deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "The project was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "The validation error(s)",
    ),
  },
});

export const deleteAllProjectsRoute = createRoute({
  path,
  tags,
  method: "delete",
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "All projects were deleted",
    },
  },
});
