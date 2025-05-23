import { createApp } from "../../library/create-app";
import * as handlers from "./skills.handlers";
import * as routes from "./skills.routes";

const router = createApp().openapi(
  routes.getSkillsRoute,
  handlers.getSkillsHandler,
).openapi(
  routes.postSkillsRoute,
  handlers.postSkillsHandler,
).openapi(
  routes.getOneSkillsRoute,
  handlers.getOneSkillsHandler,
).openapi(
  routes.patchSkillsRoute,
  handlers.patchSkillsHandler,
).openapi(
  routes.deleteSkillsRoute,
  handlers.deleteSkillsHandler,
);

export default router;
