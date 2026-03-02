/* eslint-disable node/no-process-env */
import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

import { APP_HONO } from "../constant";

function getDotEnvFileName() {
  switch (process.env.NODE_ENV) {
    case "development":
      return ".env";
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
    PORT: z
      .coerce
      .number()
      .int()
      .default(APP_HONO.PORT),

    ENV: z.enum(["development", "production"]).default("development"),

    LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal", "trace", "silent"]).default("warn"),

    /**
     * PostgreSQL connection URL
     *
     * Format: postgresql://user:password@host:port/database
     * Using min(1) instead of url() because PostgreSQL connection strings
     * may not pass strict URL validation with all drivers.
     */
    DATABASE_URL: z.string().min(1),

    CORS_ORIGINS: z.string().default("*"),

    CANONICAL_HOST: z.string().default("www.isaiariva.com"),
    RAILWAY_HOST_SNIPPET: z.string().default("up.railway.app"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export function printEnv() {
  // eslint-disable-next-line no-console
  console.log("[Env]", {
    path: path.resolve(
      process.cwd(),
      "src",
      "environment",
      getDotEnvFileName(),
    ),
    env,
    NODE_ENV: process.env.NODE_ENV,
  });
}

export default env;
