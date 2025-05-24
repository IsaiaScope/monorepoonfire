import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhases from "stoker/http-status-phrases";

import type { AppRouterHandler } from "../../@types/open-api-hono";
import type { deleteSkillsRoute, getOneSkillsRoute, getSkillsRoute, patchSkillsRoute, postSkillsRoute } from "./skills.routes";

import database from "../../database";
import { skills } from "../../database/schema/skills-schema";

export const getSkillsHandler: AppRouterHandler<typeof getSkillsRoute> = async (c) => {
  const skills = await database.query.skills.findMany();
  return c.json(skills);
};

export const postSkillsHandler: AppRouterHandler<typeof postSkillsRoute> = async (c) => {
  const skill = c.req.valid("json");
  const skillWithTimestamp = {
    ...skill,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
  };
  const [createdSkill] = await database.insert(skills).values(skillWithTimestamp).returning();
  return c.json(createdSkill, HttpStatusCodes.OK);
};

export const getOneSkillsHandler: AppRouterHandler<typeof getOneSkillsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const skill = await database.query.skills.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });
  if (!skill) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(skill, HttpStatusCodes.OK);
};

export const patchSkillsHandler: AppRouterHandler<typeof patchSkillsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const skill = await database.query.skills.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  if (!skill) {
    return c.json(
      {
        message: HttpStatusPhases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const updatedSkill = {
    ...skill,
    ...updates,
    updatedAt: Date.now().toString(),
  };

  const [updated] = await database.update(skills).set(updatedSkill).where(eq(skills.id, id)).returning();

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

export const deleteSkillsHandler: AppRouterHandler<typeof deleteSkillsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await database.delete(skills)
    .where(eq(skills.id, id));
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
