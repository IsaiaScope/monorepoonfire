import type { Schema } from "hono";

import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPIHono } from "../@types/open-api-hono";

import pkg from "../../package.json" with { type: "json" };

export function configureOpenApi<S extends Schema>(app: AppOpenAPIHono<S>) {
  app.doc("/doc", {
    // https://swagger.io/specification/v3/
    openapi: "3.0.3",
    info: {
      title: "OpenAPI",
      version: pkg.version,
    },
    servers: [
      {
        url: ".", // This is the base URL for the API server do not change it, because /doc is the default path for the OpenAPI documentation
        description: "Monorepo API Server",
      },
    ],
  });

  // https://www.npmjs.com/package/@scalar/hono-api-reference
  // https://dashboard.scalar.com/
  app.get("/scalar", Scalar({
    url: "/doc",
    pageTitle: "Scalar",
    hideModels: true,
    theme: "kepler",
    layout: "classic",
    defaultHttpClient: {
      clientKey: "fetch",
      targetKey: "js",
    },
  }));
}
