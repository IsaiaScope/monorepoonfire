/**
 * Railway to canonical domain redirect middleware
 *
 * Redirects Railway hosting domains to the canonical domain for SEO.
 * This ensures search engines index www.isaiariva.com instead of
 * the Railway-provided *.up.railway.app domain.
 */

import type { Context } from "hono";

import env from "../environment/env";

/**
 * Middleware to redirect Railway domain to canonical domain
 *
 * @param c - Hono context object
 * @param next - Next middleware function
 * @returns Redirect response or continues to next middleware
 */
export async function redirectHost(c: Context, next: () => Promise<void>) {
  const host = (c.req.header("host") || "").toLowerCase();

  // Redirect Railway-provided domain to canonical host
  if (host.includes(env.RAILWAY_HOST_SNIPPET)) {
    // preserve path and query
    const url = new URL(c.req.url);
    url.hostname = env.CANONICAL_HOST;
    url.protocol = "https";
    return c.redirect(url.toString(), 301);
  }

  return next();
}
