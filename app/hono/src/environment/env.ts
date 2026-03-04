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

    // min(1) instead of url() — some PostgreSQL drivers use non-standard URL formats
    DATABASE_URL: z.string().min(1),

    CORS_ORIGINS: z.string().default("*"),

    // When set, write endpoints require `Authorization: Bearer <API_KEY>`; when unset, they're open
    API_KEY: z.string().min(1).optional(),
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
