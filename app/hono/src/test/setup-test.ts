// import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll } from "vitest";

beforeAll(async () => {
  console.warn("Running migrations...");
  // execSync("pnpm drizzle-kit push");
});

afterAll(async () => {
  console.warn("Cleaning up...");
  console.warn("Cleaning up2...");
  fs.rmSync("dev.database", { force: true });
});
