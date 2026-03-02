import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteAllProjectsRoute, deleteProjectRoute, getOneProjectRoute, getProjectsRoute, patchProjectRoute, postProjectRoute } from "./projects.routes";

import database from "../../database";
import { projects } from "../../database/schema/projects-schema";

export const getProjectsHandler: AppRouterHandler<typeof getProjectsRoute> = async (c) => {
  const projectsList = await database.query.projects.findMany();
  return c.json(projectsList);
};

export const postProjectHandler: AppRouterHandler<typeof postProjectRoute> = async (c) => {
  const project = c.req.valid("json");
  const [createdProject] = await database.insert(projects).values(project).returning();
  return c.json(createdProject, HttpStatusCodes.OK);
};

export const getOneProjectHandler: AppRouterHandler<typeof getOneProjectRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const project = await database.query.projects.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!project) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(project, HttpStatusCodes.OK);
};

export const patchProjectHandler: AppRouterHandler<typeof patchProjectRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const project = await database.query.projects.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!project) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [updatedProject] = await database.update(projects).set(updates).where(eq(projects.id, id)).returning();
  return c.json(updatedProject, HttpStatusCodes.OK);
};

export const deleteProjectHandler: AppRouterHandler<typeof deleteProjectRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const project = await database.query.projects.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!project) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await database.delete(projects).where(eq(projects.id, id));
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const deleteAllProjectsHandler: AppRouterHandler<typeof deleteAllProjectsRoute> = async (c) => {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await database.delete(projects);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
