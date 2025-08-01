import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteAllProjectsRoute, deleteProjectRoute, getOneProjectRoute, getProjectsRoute, patchProjectRoute, postProjectRoute } from "./projects.routes";

import database from "../../database";
import { projects } from "../../database/schema/projects-schema";

// Helper function to transform project data for output
function transformProjectForOutput(project: typeof projects.$inferSelect) {
  return {
    ...project,
    subDescription: typeof project.subDescription === "string"
      ? JSON.parse(project.subDescription)
      : project.subDescription,
    tags: typeof project.tags === "string"
      ? JSON.parse(project.tags)
      : project.tags,
  };
}

export const getProjectsHandler: AppRouterHandler<typeof getProjectsRoute> = async (c) => {
  const projectsList = await database.query.projects.findMany();
  const transformedProjects = projectsList.map(transformProjectForOutput);
  return c.json(transformedProjects);
};

export const postProjectHandler: AppRouterHandler<typeof postProjectRoute> = async (c) => {
  const project = c.req.valid("json");
  const projectWithTimestamp = {
    ...project,
    subDescription: JSON.stringify(project.subDescription),
    tags: JSON.stringify(project.tags),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };
  const [createdProject] = await database.insert(projects).values(projectWithTimestamp).returning();
  return c.json(transformProjectForOutput(createdProject), HttpStatusCodes.OK);
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
  return c.json(transformProjectForOutput(project), HttpStatusCodes.OK);
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

  const updatedProjectData = {
    ...updates,
    ...(updates.subDescription && {
      subDescription: JSON.stringify(updates.subDescription),
    }),
    ...(updates.tags && {
      tags: JSON.stringify(updates.tags),
    }),
    updatedAt: Date.now().toString(),
  };

  const [updatedProject] = await database.update(projects).set(updatedProjectData).where(eq(projects.id, id)).returning();
  return c.json(transformProjectForOutput(updatedProject), HttpStatusCodes.OK);
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
