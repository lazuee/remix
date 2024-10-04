import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

import env from "~/constants";

export const themeSessionResolver = createThemeSessionResolver(
  createCookieSessionStorage({
    cookie: {
      name: "_theme",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: ["r3m1x"],
      ...(env.IS_PRODUCTION_BUILD && (env.IS_GITPOD || env.IS_VERCEL) && { domain: env.SITE_URL, secure: true }),
    },
  }),
);
