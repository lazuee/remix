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
const GITPOD_WORKSPACE_URL = getEnv("GITPOD_WORKSPACE_URL")?.replace("https://", `${APP_PORT}-`);
const GITHUB_CODESPACE_URL = getEnv("CODESPACE_NAME") ? `${getEnv("CODESPACE_NAME")}-${APP_PORT}.app.github.dev` : undefined;
const VERCEL_URL = getEnv("VERCEL_PROJECT_PRODUCTION_URL");
const SITE_URL = GITPOD_WORKSPACE_URL || GITHUB_CODESPACE_URL || VERCEL_URL || APP_URL;
const NODE_ENV = getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || "development";
const IS_PRODUCTION_BUILD = NODE_ENV === "production";

const IS_GITPOD_WORKSPACE = !!GITPOD_WORKSPACE_URL;
const IS_GITHUB_CODESPACE = !!GITHUB_CODESPACE_URL;
const IS_VERCEL = !!VERCEL_URL;
const IS_HOSTED = IS_GITPOD_WORKSPACE || IS_GITHUB_CODESPACE || IS_VERCEL;

export default {
  APP_PORT,
  APP_URL,
  GITPOD_WORKSPACE_URL,
  GITHUB_CODESPACE_URL,
  VERCEL_URL,
  SITE_URL,
  NODE_ENV,
  IS_PRODUCTION_BUILD,
  IS_GITPOD_WORKSPACE,
  IS_GITHUB_CODESPACE,
  IS_VERCEL,
  IS_HOSTED,
};
