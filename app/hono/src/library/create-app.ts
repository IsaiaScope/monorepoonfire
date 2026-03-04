import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "hono-pino";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timing } from "hono/timing";
import pino from "pino";
import pretty from "pino-pretty";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { AppEnv, AppOpenAPIHono } from "../@types/open-api-hono";

import { env } from "../environment/env";

// eslint-disable-next-line ts/no-empty-object-type
export function createApp<S extends Schema = {}>() {
  return new OpenAPIHono<AppEnv, S>({
    // allows routes with or without trailing slashes
    strict: false,
    // auto-validates requests against OpenAPI schemas
    defaultHook,
  });
}

export function initApp() {
  const app = createApp();

  app.use(compress());
  app.use(serveEmojiFavicon("🔥"));

  const getCorsOrigins = () => {
    const corsOrigins = env.CORS_ORIGINS;
    if (corsOrigins === "*") {
      return "*";
    }
    return corsOrigins.split(",").map(origin => origin.trim()).filter(origin => origin);
  };

  app.use(
    cors({
      origin: getCorsOrigins(),
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
      maxAge: 86400,
    }),
  );

  // https://hono.dev/docs/middleware/builtin/request-id
  app.use(requestId()).use(
    // https://www.npmjs.com/package/hono-pino
    pinoLogger({
      pino: pino({
        level: env.LOG_LEVEL || "info",
      }, env.ENV === "production" ? undefined : pretty()),
    }),
  );

  // Traefik base middleware handles HSTS, X-Frame-Options, etc.
  // CSP only in production — dev needs permissive headers for Scalar CDN scripts
  if (env.ENV === "production") {
    app.use("*", secureHeaders({
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"],
        workerSrc: ["'self'", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", "wss:", "blob:", "https://api.emailjs.com"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
      strictTransportSecurity: false,
      xContentTypeOptions: false,
      xFrameOptions: false,
      xXssProtection: false,
    }));
  }

  app.use("*", timing());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPIHono<S>) {
  return initApp().route("/", router);
}
