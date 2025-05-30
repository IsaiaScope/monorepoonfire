import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Schema } from "hono";

import type { createApp } from "../library/create-app";
import type { AppBindings } from "./pino";

export type AppEnv = AppBindings;

export type AppOpenAPIHono<S extends Schema> = ReturnType<typeof createApp<S>>;

export type AppRouterHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
