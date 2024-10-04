import { createRequestHandler } from "@remix-run/node";
import { getClientIPAddress } from "remix-utils/get-client-ip-address";

import type { HttpBindings } from "@hono/node-server";
import type { ServerBuild } from "@remix-run/node";
import type { Context } from "hono";
import env from "~/constants";

declare module "@remix-run/node" {
  export interface AppLoadContext {
    readonly clientIp?: string;
    readonly nonce?: string;
    readonly env: typeof env;
  }
}

export default function remixHandler(build: ServerBuild, c: Context<{ Bindings: HttpBindings }>) {
  const nonce = `nonce-${Math.random().toString(36).slice(2)}`;
  c.res.headers.set("Content-Security-Policy", getContentSecurityPolicy(nonce));

  const requestHandler = createRequestHandler(build, "production");
  return requestHandler(c.req.raw, {
    clientIp: getClientIPAddress(c.req.raw.headers) ?? undefined,
    nonce,
    env,
  });
}

export function getContentSecurityPolicy(nonce?: string) {
  nonce = nonce ? `'nonce-${nonce}'` : "";
  const self = "'self'";

  return [
    `default-src ${self}`,
    `script-src ${self} ${nonce}`,
    `style-src ${self} 'unsafe-inline'`,
    `font-src ${self} https: data:`,
    `img-src ${self} data: blob: https:`,
    `connect-src ${self} ws: wss:`,
    `media-src ${self} https:`,
    "object-src 'none'",
    `child-src ${self}`,
    `frame-src ${self} https:`,
    `worker-src blob:`,
    "frame-ancestors 'none'",
    `form-action ${self}`,
    `base-uri ${self}`,
    `manifest-src https:`,
    "block-all-mixed-content",
  ]
    .map((x) => `${x};`)
    .join(" ")
    .trim();
}
