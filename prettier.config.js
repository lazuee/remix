//@ts-check

import { createRequire } from "node:module";

const readJSON = (path) => createRequire(import.meta.url)(path);
const packageJson = readJSON("./package.json");

/**
 * @param {import("prettier").Config &
 *   import("@ianvs/prettier-plugin-sort-imports").PluginConfig &
 *   Partial<import("./node_modules/prettier-plugin-jsdoc/dist/types").JsdocOptions> &
 *   import("prettier-plugin-tailwindcss").PluginOptions} config
 */
function defineConfig(config) {
  return config;
}

const dirNames = ["routes", "components", "lib", "styles"];

export const config = defineConfig({
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-jsdoc", "prettier-plugin-css-order", "prettier-plugin-tailwindcss"],
  importOrder: [
    "",
    "<TYPES>^(node:)",
    "<BUILTIN_MODULES>",
    "",
    "^(react$)",
    "^(react/(.*)$)",
    "^(react-(.*)$)",
    "^(?!.*remix)(.*)react(.*)$",
    "",
    "^(@remix-run/(.*)$)",
    "^(remix-(.*)$)",
    "^((.*)remix(.*)$)",
    "",
    "^(vite$)",
    "^(vite/(.*)$)",
    "^(vite-plugin(.*)$)",
    "^(vite-(.*)$)",
    "^((.*)vite(.*)$)",
    "",
    "<TYPES>",
    "<THIRD_PARTY_MODULES>",
    "",
    `<TYPES>^~\\/(\\/.*)$`,
    `^~\\/(\\/.*)$`,
    ...dirNames.map((name) => [`<TYPES>^~\\/${name}(\\/.*)$`, `^~\\/${name}(\\/.*)$`]).flat(),
    "",
    "<TYPES>^[.]",
    "^[.]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "importAttributes", "decorators"],
  importOrderTypeScriptVersion: packageJson.devDependencies.typescript,
  jsdocCommentLineStrategy: "singleLine",
  tsdoc: true,
  cssDeclarationSorterOrder: "smacss",
  tailwindFunctions: ["cn"],
  tailwindAttributes: ["class", ".*[cC]lassName"],
  overrides: [
    {
      files: "{**/.vscode/*.json,**/tsconfig.json}",
      options: {
        parser: "json5",
        quoteProps: "preserve",
        singleQuote: false,
        trailingComma: "all",
      },
    },
    {
      files: "*.css",
      options: {
        singleQuote: false,
      },
    },
    {
      files: ["**/*.mdx"],
      options: {
        proseWrap: "preserve",
        htmlWhitespaceSensitivity: "ignore",
      },
    },
  ],
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: true,
  useTabs: false,
  semi: true,
  tabWidth: 2,
  printWidth: 160,
  endOfLine: "lf",
});

export default config;
