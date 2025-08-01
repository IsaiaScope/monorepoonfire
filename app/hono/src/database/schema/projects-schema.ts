import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true }),
  language: text("language", { length: 50 }).notNull(),
  subDescription: text("subDescription", { length: 2000 }).notNull(), // Store as JSON string array
  description: text("description", { length: 200 }).notNull(),
  href: text("href", { length: 200 }).notNull(),
  repo: text("repo", { length: 200 }).notNull(),
  image: text("image", { length: 200 }).notNull(),
  title: text("title", { length: 100 }).notNull(),
  tags: text("tags", { length: 500 }).notNull(), // Assuming tags are stored as a JSON string
  createdAt: text("createdAt", {
    length: 50,
  }).notNull(),
  updatedAt: text("updatedAt", {
    length: 50,
  }).notNull(),
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
  }).nonempty().max(200).openapi({
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
  },
  ),
  image: z.string({
    description: "The image URL of the project",
  }).nonempty().max(200).openapi({
    example: "/assets/garden-on-fire.png",
  }),

  createdAt: z.string({
    description: "The timestamp when the project was created",
  }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
  updatedAt: z.string({ description: "The timestamp when the project was last updated" }).nonempty().max(50).openapi({
    example: Date.now().toString(),
  }),
});

export const selectProjectsSchema = projectsTableSchema;

export const insertProjectsSchema = projectsTableSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
