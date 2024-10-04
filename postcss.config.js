//@ts-check

/** @param {import("postcss-load-config").Config} config */
function defineConfig(config) {
  return config;
}

export default defineConfig({
  plugins: {
    "postcss-import-ext-glob": {},
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
});
