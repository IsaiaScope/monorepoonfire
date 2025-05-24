import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const skills = sqliteTable("skills", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text("name", { length: 100 }).notNull().unique(),
  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
});

const skillsTableSchema = z.object({
  id: z.number({ description: "The unique identifier of the skill" }).int().positive().openapi({
    example: 3,
  }),
  name: z.string({
    description: "The name of the skill",
  }).nonempty().max(100).openapi({
    example: "JavaScript",
  }),
  createdAt: z.string({
    description: "The timestamp when the skill was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
  updatedAt: z.string({ description: "The timestamp when the skill was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

export const selectSkillsSchema = skillsTableSchema;

export const insertSkillsSchema = skillsTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
