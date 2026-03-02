import { z } from "@hono/zod-openapi";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull().unique(),

  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
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
  }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),

  updatedAt: z.string({ description: "The timestamp when the skill was last updated" }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),
});

export const selectSkillsSchema = skillsTableSchema;

export const insertSkillsSchema = skillsTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
