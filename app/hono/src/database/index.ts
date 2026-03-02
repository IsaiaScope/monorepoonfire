import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../environment/env";
import * as curriculumSchema from "./schema/curriculum-schema";
import * as projectsSchema from "./schema/projects-schema";
import * as skillsSchema from "./schema/skills-schema";
import * as workExperienceSchema from "./schema/work-experience-schema";

const client = postgres(env.DATABASE_URL);

const database = drizzle(client, {
  schema: {
    ...curriculumSchema,
    ...skillsSchema,
    ...workExperienceSchema,
    ...projectsSchema,
  },
});

export default database;
