import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workExperiences = sqliteTable("work-experience", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  language: text("language", { length: 50 }).notNull(),
  role: text("name", { length: 100 }).notNull(),
  company: text("company", { length: 100 }).notNull(),
  location: text("location", { length: 100 }).notNull(),
  longDescription: text("description", { length: 1000 }).notNull(),
  shortDescription: text("shortDescription", { length: 200 }).notNull(),
  startDate: text("startDate", { length: 50 }).notNull(),
  endDate: text("endDate", { length: 50 }).notNull(),
  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
});

const workExperiencesTableSchema = z.object({
  id: z.number({ description: "The unique identifier of the work experience" }).int().positive().openapi({
    example: 3,
  }),
  language: z.string({
    description: "The language of the work experience",
  }).nonempty().max(50).openapi({
    example: "en-GB",
  }),
  role: z.string({
    description: "The role of the work experience",
  }).nonempty().max(100).openapi({
    example: "Software Engineer",
  }),
  company: z.string({
    description: "The company where the work experience took place",
  }).nonempty().max(100).openapi({
    example: "Tech Company",
  }),
  location: z.string({
    description: "The location of the work experience",
  }).nonempty().max(100).openapi({
    example: "San Francisco, CA",
  }),
  longDescription: z.string({
    description: "A detailed description of the work experience",
  }).nonempty().max(1000).openapi({
    example: "Worked on various projects involving web development and cloud computing.",
  }),
  shortDescription: z.string({
    description: "A brief description of the work experience",
  }).nonempty().max(200).openapi({
    example: "Developed web applications and managed cloud infrastructure.",
  }),
  startDate: z.string({
    description: "The start date of the work experience",
  }).nonempty().max(50).openapi({
    example: "2022-01-01",
  }),
  endDate: z.string({
    description: "The end date of the work experience",
  }).nonempty().max(50).openapi({
    example: "2023-01-01",
  }),
  createdAt: z.string({
    description: "The timestamp when the work experience was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
  updatedAt: z.string({ description: "The timestamp when the work experience was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

export const selectWorkExperiencesSchema = workExperiencesTableSchema;

export const insertWorkExperiencesSchema = workExperiencesTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
