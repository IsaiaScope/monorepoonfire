import createConfig from "@package/config/eslint/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default createConfig({
  ignores: ["**/routeTree.gen.ts"],
  react: true,
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: ["README.md", "reportWebVitals.ts"],
    }],
  },
});
