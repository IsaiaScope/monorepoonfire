import { serve } from "@hono/node-server";

import app from "./app";
import env, { printEnv } from "./environment/env";

const port = env.PORT;

serve({
  fetch: app.fetch,
  port: +port,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`);
});

printEnv();
