import { APP_HONO } from "../../constant";
import { createApp } from "../../library/create-app";
import * as handlers from "./curriculum.handlers";
import * as routes from "./curriculum.routes";

const router = createApp().basePath(APP_HONO.BASE_PATH).openapi(
  routes.getCurriculumRoute,
  handlers.getCurriculumHandler,
).openapi(
  routes.postCurriculumRoute,
  handlers.postCurriculumHandler,
).openapi(
  routes.getOneCurriculumRoute,
  handlers.getOneCurriculumHandler,
).openapi(
  routes.patchCurriculumRoute,
  handlers.patchCurriculumHandler,
).openapi(
  routes.deleteCurriculumRoute,
  handlers.deleteCurriculumHandler,
);

export default router;
