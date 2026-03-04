import { createMiddleware } from "hono/factory";

import { env } from "../environment/env";

export const apiKeyAuth = createMiddleware(async (c, next) => {
  if (c.req.method === "GET" || c.req.method === "OPTIONS") {
    return next();
  }

  if (!env.API_KEY) {
    return next();
  }

  const authHeader = c.req.header("Authorization");
  if (authHeader !== `Bearer ${env.API_KEY}`) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return next();
});
