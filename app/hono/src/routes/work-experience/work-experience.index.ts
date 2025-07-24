import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./work-experience.handlers";
import * as routes from "./work-experience.routes";

const router = createApp().basePath(APP_HONO.BASE_PATH).openapi(
  routes.getWorkExperienceRoute,
  handlers.getWorkExperienceHandler,
).openapi(
  routes.postWorkExperienceRoute,
  handlers.postWorkExperienceHandler,
).openapi(
  routes.getOneWorkExperienceRoute,
  handlers.getOneWorkExperienceHandler,
).openapi(
  routes.patchWorkExperienceRoute,
  handlers.patchWorkExperienceHandler,
).openapi(
  routes.deleteWorkExperienceRoute,
  handlers.deleteWorkExperienceHandler,
);

export default router;
