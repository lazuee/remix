//@ts-check

import { env } from "node:process";

import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import remixFlexRoutes from "@resolid/remix-plugins/flex-routes";
import { nodeHonoPreset } from "@resolid/remix-plugins/node-hono";
import { vercelServerlessPreset } from "@resolid/remix-plugins/vercel-serverless";

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import browserslistToEsbuild from "browserslist-to-esbuild";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

installGlobals({ nativeFetch: true });

export default defineConfig(() => {
  const port = parseInt(env?.PORT || "3000");

  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          unstable_optimizeDeps: true,
        },
        serverModuleFormat: "esm",
        ignoredRouteFiles: ["**/*"],
        routes: async () => {
          return await remixFlexRoutes({
            ignoredRouteFiles: ["**/.*", "**/__*/*", "**/__*.*"],
          });
        },
        presets: [nodeHonoPreset()],
        ...(env.VERCEL_ENV && { presets: [vercelServerlessPreset({ regions: "hnd1" })] }),
      }),
      tsconfigPaths(),
    ],
    server: {
      port,
      open: false,
    },
    optimizeDeps: {
      esbuildOptions: {
        minify: true,
        treeShaking: true,
      },
    },
    build: {
      cssMinify: "esbuild",
      minify: "terser",
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const reactPattern = /\/node_modules\/(react|react-dom|react-is|scheduler)\//;
            const reactRouterPattern = /\/node_modules\/(@remix-run|react-router|react-router-dom|turbo-stream)\//;

            if (reactPattern.test(id)) return "react";
            if (reactRouterPattern.test(id)) return "react-router";

            if (id.includes("node_modules")) {
              const parts = id.split("node_modules/")[1].split("/");
              return parts[0] === ".pnpm" ? parts[1].split("@")[0] : parts[0];
            }
          },
        },
      },
      target: browserslistToEsbuild(),
      terserOptions: {
        compress: {
          ecma: 2020,
          passes: 5,
        },
        ecma: 2020,
        format: {
          comments: false,
        },
        nameCache: {},
        toplevel: true,
      },
    },
  };
});
