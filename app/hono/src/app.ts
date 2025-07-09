import { serveStatic } from "@hono/node-server/serve-static";

import { APP_HONO } from "./constant";
import { configureOpenApi } from "./library/configure-open-api";
import { initApp } from "./library/create-app";
import index from "./routes/index.routes";
import skills from "./routes/skills/skills.index";

const app = initApp();

const routes = [
  index,
  skills,
];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

app.get("/error", () => {
  // c.var.logger.info("Hello Hono!");
  throw new Error("This is an error");
});

app.get("*", serveStatic({ root: `.${APP_HONO.PORTFOLIO}` }));
app.get("*", serveStatic({ path: `.${APP_HONO.PORTFOLIO}/index.html` }));

// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

export default app;

// export type RPC = typeof routes[number];
