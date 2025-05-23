// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../environment/env";
import * as skillsSchema from "./schema/skills-schema";

export function getConnection(connectionString: string) {
  if (env.NODE_ENV === "test") {
    return new Pool({
      connectionString,
    });
  }
}

export function connect(connectionString: string) {
  return new Pool({ connectionString });
}

const database = drizzle(connect(env.DATABASE_URL), {
  schema: { ...skillsSchema },
});

export default database;
