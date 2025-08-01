import { serveStatic } from "@hono/node-server/serve-static";

import { APP_HONO } from "./constant";
import { configureOpenApi } from "./library/configure-open-api";
import { initApp } from "./library/create-app";
import index from "./routes/index.routes";
import projects from "./routes/projects/projects.index";
import skills from "./routes/skills/skills.index";
import workExperience from "./routes/work-experience/work-experience.index";

const app = initApp();

configureOpenApi(app);

const _routes = app.route(
  "/",
  skills,
).route(
  "/",
  workExperience,
).route(
  "/",
  projects,
).route("/", index);

// app.get("/error", () => {
//   c.var.logger.info("Hello Hono!");
//   throw new Error("This is an error");
// });

app.get("*", serveStatic({ root: `.${APP_HONO.PORTFOLIO}` }));
app.get("*", serveStatic({ path: `.${APP_HONO.PORTFOLIO}/index.html` }));

// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

export default app;

export type Routes = typeof _routes;
