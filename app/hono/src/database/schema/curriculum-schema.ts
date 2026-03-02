import { z } from "@hono/zod-openapi";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const curriculum = pgTable("curriculum", {
  id: serial("id").primaryKey(),

  url: varchar("url", { length: 500 }).notNull(),

  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
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
  }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),

  updatedAt: z.string({ description: "The timestamp when the curriculum entry was last updated" }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),
});

export const selectCurriculumSchema = curriculumTableSchema;

export const insertCurriculumSchema = curriculumTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
