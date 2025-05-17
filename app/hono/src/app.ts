import type { PinoLogger } from "hono-pino";

import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "hono-pino";
import { requestId } from "hono/request-id";
import pino from "pino";
import pretty from "pino-pretty";
import { notFound, onError } from "stoker/middlewares";

import env from "./environment/env";

type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

const app = new OpenAPIHono<AppBindings>();

app.use(
  // https://hono.dev/docs/middleware/builtin/request-id
  requestId(),
).use(
  // https://www.npmjs.com/package/hono-pino?activeTab=code
  pinoLogger({
    // https://www.npmjs.com/package/pino
    // https://github.com/pinojs/pino-pretty
    pino: pino({
      level: env.LOG_LEVEL,
    }, env.NODE_ENV === "production" ? undefined : pretty()),
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/error", (c) => {
  c.var.logger.info("Hello Hono!");
  throw new Error("This is an error");
});

app.notFound(notFound);
app.onError(onError);

export default app;
