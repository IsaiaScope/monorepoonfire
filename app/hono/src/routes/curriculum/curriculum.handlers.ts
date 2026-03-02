import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteCurriculumRoute, getCurriculumRoute, getOneCurriculumRoute, patchCurriculumRoute, postCurriculumRoute } from "./curriculum.routes";

import database from "../../database";
import { curriculum } from "../../database/schema/curriculum-schema";

export const getCurriculumHandler: AppRouterHandler<typeof getCurriculumRoute> = async (c) => {
  const entries = await database.query.curriculum.findMany();
  return c.json(entries);
};

export const postCurriculumHandler: AppRouterHandler<typeof postCurriculumRoute> = async (c) => {
  const entry = c.req.valid("json");
  const [created] = await database.insert(curriculum).values(entry).returning();
  return c.json(created, HttpStatusCodes.OK);
};

export const getOneCurriculumHandler: AppRouterHandler<typeof getOneCurriculumRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const entry = await database.query.curriculum.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!entry) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(entry, HttpStatusCodes.OK);
};

export const patchCurriculumHandler: AppRouterHandler<typeof patchCurriculumRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const entry = await database.query.curriculum.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!entry) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [updated] = await database.update(curriculum).set(updates).where(eq(curriculum.id, id)).returning();

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

export const deleteCurriculumHandler: AppRouterHandler<typeof deleteCurriculumRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const entry = await database.query.curriculum.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!entry) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await database.delete(curriculum).where(eq(curriculum.id, id));
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
