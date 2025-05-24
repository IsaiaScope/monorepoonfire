import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "../environment/env";
import * as skillsSchema from "./schema/skills-schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

const database = drizzle(client, {
  schema: { ...skillsSchema },
});

export default database;
