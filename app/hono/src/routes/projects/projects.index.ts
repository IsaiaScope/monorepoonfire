import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./projects.handlers";
import * as routes from "./projects.routes";

const router = createApp().basePath(APP_HONO.BASE_PATH).openapi(
  routes.getProjectsRoute,
  handlers.getProjectsHandler,
).openapi(
  routes.postProjectRoute,
  handlers.postProjectHandler,
).openapi(
  routes.getOneProjectRoute,
  handlers.getOneProjectHandler,
).openapi(
  routes.patchProjectRoute,
  handlers.patchProjectHandler,
).openapi(
  routes.deleteProjectRoute,
  handlers.deleteProjectHandler,
).openapi(
  routes.deleteAllProjectsRoute,
  handlers.deleteAllProjectsHandler,
);

export default router;
