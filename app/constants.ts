import { env } from "node:process";

import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

export function getEnv<T extends string>(key: T): NodeJS.ProcessEnv[T] {
  if (typeof env !== "undefined") return env[key];
  return;
}

const APP_PORT = getEnv("PORT") || "3000";
const APP_URL = getEnv("APP_URL") || `localhost:${APP_PORT}`;
const GITPOD_URL = getEnv("GITPOD_WORKSPACE_URL")?.replace("https://", `${APP_PORT}-`);
const VERCEL_URL = getEnv("VERCEL_PROJECT_PRODUCTION_URL");
const SITE_URL = GITPOD_URL || VERCEL_URL || APP_URL;
const NODE_ENV = getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || "development";
const IS_PRODUCTION_BUILD = NODE_ENV === "production";
const IS_GITPOD = !!getEnv("GITPOD_HOST");
const IS_VERCEL = !!getEnv("VERCEL_ENV");

export default {
  APP_PORT,
  APP_URL,
  GITPOD_URL,
  VERCEL_URL,
  SITE_URL,
  NODE_ENV,
  IS_PRODUCTION_BUILD,
  IS_GITPOD,
  IS_VERCEL,
};
