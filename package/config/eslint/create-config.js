import antfu from "@antfu/eslint-config";

/**
 * @typedef {import("@antfu/eslint-config").default} Antfu
 * @typedef {Parameters<Antfu>} AntfuParams
 * @typedef {AntfuParams[0]} Options
 * @typedef {AntfuParams[1][]} UserConfigs
 * @typedef {ReturnType<Antfu>} AntfuReturn
 */

/**
 * @param {Options} [options]
 * @param {...UserConfigs} userConfigs
 * @return {AntfuReturn}
 */
export default function createConfig(options, ...userConfigs) {
  return antfu({
    type: "app",
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ...options,
    ignores: [
      ...(options?.ignores ?? []),
      "**/CLAUDE.md",
      "**/README.md",
      "**/._*",
    ],
  }, {
    rules: {
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": ["error", {
        tsconfigRootDir: ".",
      }],
      "unicorn/filename-case": ["error", {
        case: "kebabCase",
        ignore: ["README.md", "CLAUDE.md"],
      }],
    },
  }, ...userConfigs);
}
