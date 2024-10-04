import { Analytics } from "@vercel/analytics/react";

import { Links, Meta, Scripts, ScrollRestoration, useRouteLoaderData } from "@remix-run/react";
import { PreventFlashOnWrongTheme, useTheme } from "remix-themes";
import { SpeedInsights } from "@vercel/speed-insights/remix";

import type { LoaderData } from "~/root";

import { cn } from "~/lib/utils";

export function RootLayout({ children }: React.PropsWithChildren) {
  const data = (useRouteLoaderData("root") ?? {}) as LoaderData;
  const [theme] = useTheme();

  return (
    <html lang="en" className={cn(theme)}>
      <head>
        <PreventFlashOnWrongTheme nonce={data.nonce} ssrTheme={Boolean(data.theme)} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {data.env?.IS_VERCEL && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
        <ScrollRestoration nonce={data.nonce} />
        <Scripts nonce={data.nonce} />
      </body>
    </html>
  );
}
