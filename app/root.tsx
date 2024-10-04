import { Analytics } from "@vercel/analytics/react";

import { Outlet, useRouteLoaderData } from "@remix-run/react";
import { Theme, ThemeProvider } from "remix-themes";
import { SpeedInsights } from "@vercel/speed-insights/remix";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { themeSessionResolver } from "~/sessions.server";

import { ErrorLayout } from "~/components/error.layout";
import { RootLayout } from "~/components/root.layout";

import.meta.glob("./styles/**/*.scss", { eager: true });

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export interface LoaderData {
  clientIp: LoaderFunctionArgs["context"]["clientIp"];
  env: LoaderFunctionArgs["context"]["env"];
  nonce: LoaderFunctionArgs["context"]["nonce"];
  theme: Theme | null;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  return {
    clientIp: context.clientIp,
    theme: getTheme(),
    env: context.env ?? {},
    nonce: context.nonce,
  } as LoaderData;
}

export default function Root() {
  const data = (useRouteLoaderData("root") ?? {}) as LoaderData;

  return (
    <ThemeProvider specifiedTheme={data.theme ?? null} themeAction="/resources/set-theme">
      <RootLayout>
        <Outlet />
        {data.env?.IS_VERCEL && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </RootLayout>
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const data = (useRouteLoaderData("root") ?? {}) as LoaderData;

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/resources/set-theme">
      <RootLayout>
        <ErrorLayout data={data} />
      </RootLayout>
    </ThemeProvider>
  );
}

export function HydrateFallback() {
  return <h1>Loading...</h1>;
}
