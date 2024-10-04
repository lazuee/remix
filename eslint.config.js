// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default tseslint.config(includeIgnoreFile(gitignorePath), eslint.configs.recommended, ...tseslint.configs.recommended, {
  plugins: {
    "@typescript-eslint": tseslint.plugin,
    "unused-imports": unusedImports,
  },
  rules: {
    "no-unused-private-class-members": "warn",
    "unused-imports/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "unused-imports/no-unused-imports": "warn",
    "no-undef": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-object-type": "off",
  },
});
