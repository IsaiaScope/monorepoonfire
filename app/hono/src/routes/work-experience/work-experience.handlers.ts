import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteAllWorkExperienceRoute, deleteWorkExperienceRoute, getOneWorkExperienceRoute, getWorkExperienceRoute, patchWorkExperienceRoute, postWorkExperienceRoute } from "./work-experience.routes";

import database from "../../database";
import { workExperiences } from "../../database/schema/work-experience-schema";

export const getWorkExperienceHandler: AppRouterHandler<typeof getWorkExperienceRoute> = async (c) => {
  const workExperience = await database.query.workExperiences.findMany();
  return c.json(workExperience);
};

export const postWorkExperienceHandler: AppRouterHandler<typeof postWorkExperienceRoute> = async (c) => {
  const workExperience = c.req.valid("json");
  const workExperienceWithTimestamp = {
    ...workExperience,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };
  const [createdWorkExperience] = await database.insert(workExperiences).values(workExperienceWithTimestamp).returning();
  return c.json(createdWorkExperience, HttpStatusCodes.OK);
};

export const getOneWorkExperienceHandler: AppRouterHandler<typeof getOneWorkExperienceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const workExperience = await database.query.workExperiences.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!workExperience) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(workExperience, HttpStatusCodes.OK);
};

export const patchWorkExperienceHandler: AppRouterHandler<typeof patchWorkExperienceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const workExperience = await database.query.workExperiences.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!workExperience) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const updatedWorkExperience = {
    ...workExperience,
    ...updates,
    updatedAt: Date.now().toString(),
  };

  const [updated] = await database.update(workExperiences).set(updatedWorkExperience).where(eq(workExperiences.id, id)).returning();

  if (!updated) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

export const deleteWorkExperienceHandler: AppRouterHandler<typeof deleteWorkExperienceRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await database.delete(workExperiences)
    .where(eq(workExperiences.id, id));
  if (!result.rowsAffected) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const deleteAllWorkExperienceHandler: AppRouterHandler<typeof deleteAllWorkExperienceRoute> = async (c) => {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await database.delete(workExperiences);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
