/* eslint-disable node/no-process-env */
import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

// Using cross-env is a great idea if you want your scripts to work consistently across all operating systems (Linux, macOS, Windows).

/*
dotenv-expand is a companion package for dotenv that allows you to use environment variable expansion in your .env files.
What does that mean?
It lets you reference other environment variables inside your .env file, like this:
HOST=localhost
PORT=3000
URL=http://${HOST}:${PORT}
*/

function getDotEnvFileName() {
  switch (process.env.NODE_ENV) {
    case "development":
      return ".env";
    case "test":
      return ".env.test";
    case "production":
      return ".env.production";
    default:
      return ".env";
  }
}

expand(config({
  path: path.resolve(
    process.cwd(),
    "src",
    "environment",
    getDotEnvFileName(),
  ),
}));

export const env = createEnv({
  server: {
    // coerce explanation: https://www.youtube.com/watch?v=9Ab1f0MaZc8
    PORT: z
      .coerce
      .number()
      .int(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    ENV: z.enum(["development", "test", "production"]),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal", "trace", "silent"]).default("info"),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export default env;

// eslint-disable-next-line no-console
console.log("[Env]", {
  path: path.resolve(
    process.cwd(),
    "src",
    "environment",
    getDotEnvFileName(),
  ),
  env,
});
