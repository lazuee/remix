/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV?: "production" | "development";
      readonly VERCEL_ENV?: "production" | "preview" | "development";
    }
  }
}
