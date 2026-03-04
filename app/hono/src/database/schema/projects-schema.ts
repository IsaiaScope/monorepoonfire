import { z } from "@hono/zod-openapi";
import { jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),

  language: varchar("language", { length: 50 }).notNull(),

  subDescription: jsonb("subDescription").notNull().$type<string[]>(),

  description: varchar("description", { length: 500 }).notNull(),

  href: varchar("href", { length: 200 }).notNull(),

  repo: varchar("repo", { length: 200 }).notNull(),

  image: varchar("image", { length: 200 }).notNull(),

  title: varchar("title", { length: 100 }).notNull(),

  tags: jsonb("tags").notNull().$type<{ id: number; name: string }[]>(),

  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

const projectsTableSchema = z.object({
  id: z.number({ description: "The unique identifier of the project" }).int().positive().openapi({
    example: 3,
  }),

  language: z.string({
    description: "The language of the project",
  }).nonempty().max(50).openapi({
    example: "en-GB",
  }),

  title: z.string({
    description: "The title of the project",
  }).nonempty().max(100).openapi({
    example: "Note Blog",
  }),

  description: z.string({
    description: "A brief description of the project",
  }).nonempty().max(500).openapi({
    example: "This is a brief description of the project.",
  }),

  subDescription: z.array(z.string().nonempty()).openapi({
    description: "A detailed description of the project as array of strings",
    example: ["Feature 1 description", "Feature 2 description", "Additional details"],
  }),

  tags: z.array(z.object({
    id: z.number().int().positive(),
    name: z.string().nonempty(),
  })).openapi({
    description: "An array of tags associated with the project",
    example: [{ id: 1, name: "JavaScript" }, { id: 2, name: "Markdown" }],
  }),

  href: z.string({
    description: "The URL of the project",
  }).nonempty().max(200).openapi({
    example: "https://garden-on-fire.vercel.app/",
  }),

  repo: z.string({
    description: "The repository URL of the project",
  }).nonempty().max(200).openapi({
    example: "https://github.com/IsaiaScope/garden-on-fire",
  }),

  image: z.string({
    description: "The image URL of the project",
  }).nonempty().max(200).openapi({
    example: "/assets/garden-on-fire.webp",
  }),

  createdAt: z.string({
    description: "The timestamp when the project was created",
  }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),

  updatedAt: z.string({ description: "The timestamp when the project was last updated" }).openapi({
    example: "2024-01-01T00:00:00.000Z",
  }),
});

export const selectProjectsSchema = projectsTableSchema;

export const insertProjectsSchema = projectsTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
