//@ts-check

import { scrollbarColor, scrollbarGutter, scrollbarWidth } from "tailwind-scrollbar-utilities";

/** @param {import("tailwindcss").Config} config */
function defineConfig(config) {
  return config;
}

export default defineConfig({
  important: true,
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[class="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [...[scrollbarGutter(), scrollbarWidth(), scrollbarColor()].filter(Boolean)],
});
