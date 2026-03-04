import { serveStatic } from "@hono/node-server/serve-static";
import { etag } from "hono/etag";

import { APP_HONO } from "./constant";
import { env } from "./environment/env";
import { apiKeyAuth } from "./library/auth-middleware";
import { configureOpenApi } from "./library/configure-open-api";
import { initApp } from "./library/create-app";
import curriculum from "./routes/curriculum/curriculum.index";
import projects from "./routes/projects/projects.index";
import skills from "./routes/skills/skills.index";
import workExperience from "./routes/work-experience/work-experience.index";

const app = initApp();

if (env.ENV !== "production") {
  configureOpenApi(app);
}

app.use(`${APP_HONO.BASE_PATH}/*`, apiKeyAuth);

const _routes = app.route(
  "/",
  curriculum,
).route(
  "/",
  skills,
).route(
  "/",
  workExperience,
).route(
  "/",
  projects,
);

app.use("*", etag());

// Hashed assets: cache forever
app.get(
  "/assets/*",
  serveStatic({
    root: `.${APP_HONO.PORTFOLIO}`,
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=31536000, immutable");
    },
  }),
);

// Static files: cache 1 day
app.get(
  "*",
  serveStatic({
    root: `.${APP_HONO.PORTFOLIO}`,
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=86400");
    },
  }),
);

// SPA fallback: always revalidate
app.get(
  "*",
  serveStatic({
    path: `.${APP_HONO.PORTFOLIO}/index.html`,
    onFound: (_path, c) => {
      c.header("Cache-Control", "no-cache");
    },
  }),
);

export default app;

export type Routes = typeof _routes;
