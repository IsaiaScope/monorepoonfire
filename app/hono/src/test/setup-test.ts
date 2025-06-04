// import { execSync } from "node:child_process";
// import fs from "node:fs";
import { afterAll } from "vitest";

afterAll(() => {
  console.warn("Cleaning up...");
  // fs.rmSync("dev.database", { force: true });
});
