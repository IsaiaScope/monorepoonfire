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

// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

app.get("/error", () => {
  // c.var.logger.info("Hello Hono!");
  throw new Error("This is an error");
});

export default app;
