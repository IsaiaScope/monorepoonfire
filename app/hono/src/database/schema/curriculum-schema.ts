import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const curriculum = sqliteTable("curriculum", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),

  url: text("url", { length: 500 }).notNull(),

  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
});

const curriculumTableSchema = z.object({
  id: z.number({ description: "The unique identifier of the curriculum entry" }).int().positive().openapi({
    example: 1,
  }),

  url: z.string({
    description: "The URL of the curriculum/CV file",
  }).nonempty().max(500).openapi({
    example: "https://example.com/cv.pdf",
  }),

  createdAt: z.string({
    description: "The timestamp when the curriculum entry was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),

  updatedAt: z.string({ description: "The timestamp when the curriculum entry was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

export const selectCurriculumSchema = curriculumTableSchema;

export const insertCurriculumSchema = curriculumTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
