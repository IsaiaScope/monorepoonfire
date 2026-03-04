import type { Schema } from "hono";

import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPIHono } from "../@types/open-api-hono";

import pkg from "../../package.json" with { type: "json" };

export function configureOpenApi<S extends Schema>(app: AppOpenAPIHono<S>) {
  app.doc("/doc", {
    openapi: "3.0.3",
    info: {
      title: "OpenAPI",
      version: pkg.version,
    },
  });

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
