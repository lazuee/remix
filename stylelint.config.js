//@ts-check

/** @param {import("stylelint").Config} config */
function defineConfig(config) {
  return config;
}

export default defineConfig({
  extends: ["stylelint-config-standard-scss", "stylelint-config-tailwindcss", "stylelint-config-clean-order", "stylelint-prettier/recommended"],
  overrides: [
    {
      files: ["*.scss"],
      plugins: ["stylelint-scss"],
    },
  ],
  rules: {
    "prettier/prettier": true,
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen", "layer", "import", "import-glob"],
      },
    ],
    "no-descending-specificity": null,
    "selector-class-pattern": null,
  },
});
