/*
 📝 NOTE:
 Syntax has the same linting problem
 https://youtu.be/KIgPJT806D0?si=EAO4Vtl7BYOeo1un&t=902
*/
import drizzle from "eslint-plugin-drizzle";

import createConfig from "./base.js";

export default createConfig({
  ignores: ["src/db/migrations/*", "public/*"],
  plugins: { drizzle },
  rules: {
    ...drizzle.configs.recommended.rules,
  },
});
