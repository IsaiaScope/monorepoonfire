import { z } from "@hono/zod-openapi";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: varchar("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: varchar("updatedAt", {
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
