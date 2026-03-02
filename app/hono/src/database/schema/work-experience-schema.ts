import { z } from "@hono/zod-openapi";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const workExperiences = pgTable("work-experience", {
  id: serial("id").primaryKey(),

  language: varchar("language", { length: 50 }).notNull(),

  role: varchar("name", { length: 100 }).notNull(),

  company: varchar("company", { length: 100 }).notNull(),

  location: varchar("location", { length: 100 }).notNull(),

  longDescription: varchar("description", { length: 1000 }).notNull(),

  shortDescription: varchar("shortDescription", { length: 500 }).notNull(),

  startDate: varchar("startDate", { length: 50 }).notNull(),

  endDate: varchar("endDate", { length: 50 }).notNull(),

  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
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
  }).nonempty().max(500).openapi({
    example: "Developed web applications and managed cloud infrastructure.",
  }),

  startDate: z.string({
    description: "The start date of the work experience",
  }).nonempty().max(50).openapi({
    example: "2022-01",
  }),

  endDate: z.string({
    description: "The end date of the work experience",
  }).nonempty().max(50).openapi({
    example: "2023-01",
  }),

  createdAt: z.string({
    description: "The timestamp when the work experience was created",
  }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),

  updatedAt: z.string({ description: "The timestamp when the work experience was last updated" }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),
});

export const selectWorkExperiencesSchema = workExperiencesTableSchema;

export const insertWorkExperiencesSchema = workExperiencesTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
