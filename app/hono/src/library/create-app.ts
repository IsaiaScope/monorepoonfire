import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "hono-pino";
import { requestId } from "hono/request-id";
import { env } from "node:process";
import pino from "pino";
import pretty from "pino-pretty";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { AppOpenAPIHono } from "../@types/open-api-hono";
import type { AppBindings } from "../@types/pino";

// eslint-disable-next-line ts/no-empty-object-type
export function createApp<S extends Schema = {}>() {
  return new OpenAPIHono<AppBindings, S>({
    /* strict: false means that the app will serve the routes also if the path ands with /
    for example /api/v1/ and /api/v1 will be served in the same way */
    strict: false,
    defaultHook,
  });
}

export function initApp() {
  const app = createApp();

  app.use(serveEmojiFavicon("🔥"));

  app.use(
  // https://hono.dev/docs/middleware/builtin/request-id
    requestId(),
  ).use(
  // https://www.npmjs.com/package/hono-pino?activeTab=code
    pinoLogger({
    // https://www.npmjs.com/package/pino
    // https://github.com/pinojs/pino-pretty
      pino: pino({
        level: env.LOG_LEVEL || "info",
      }, env.NODE_ENV === "production" ? undefined : pretty()),
    }),
  );

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPIHono<S>) {
  return initApp().route("/", router);
}
