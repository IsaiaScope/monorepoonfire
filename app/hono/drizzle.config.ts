import { defineConfig } from "drizzle-kit";

import env from "./src/environment/env";

// https://youtu.be/sNh9PoM9sUE?si=VxZt164ed8L7y3ni&t=4178
// https://orm.drizzle.team/docs/drizzle-config-file
export default defineConfig({
  schema: "./src/database/schema/*.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
});
