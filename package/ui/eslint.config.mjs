import createConfig from "@package/config/eslint/create-config";

export default createConfig({
  react: true,
}, {
  rules: {
    "antfu/top-level-function": "off",
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
    }],
  },
});
