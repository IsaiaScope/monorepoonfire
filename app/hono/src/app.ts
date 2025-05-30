import { serveStatic } from "@hono/node-server/serve-static";

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

app.get("*", serveStatic({ root: "./portfolio" }));
app.get("*", serveStatic({ path: "./portfolio/index.html" }));

// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

export default app;
