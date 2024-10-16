import { PassThrough } from "node:stream";

import { renderToPipeableStream } from "react-dom/server";

import { createReadableStreamFromReadable, readableStreamToString } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { cors } from "remix-utils/cors";

import type { HandleDocumentRequestFunction } from "@remix-run/node";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { isbot } from "isbot";

const ABORT_DELAY = 5_000;
const handleDocumentRequest: HandleDocumentRequestFunction = (request, responseStatusCode, responseHeaders, remixContext, { nonce, env }) => {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = responseHeaders.get("user-agent");
    const readyOption: keyof RenderToPipeableStreamOptions = (userAgent && isbot(userAgent)) || remixContext.isSpaMode ? "onAllReady" : "onShellReady";

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const { pipe, abort } = renderToPipeableStream(<RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} nonce={nonce} />, {
      nonce,
      [readyOption]: () => {
        const body = new PassThrough();
        shellRendered = true;

        readableStreamToString(createReadableStreamFromReadable(body)).then((html) => {
          responseHeaders.set("Content-Type", "text/html; charset=utf-8");

          if (env?.IS_PRODUCTION_BUILD) {
            html = applyPreloadScripts(html);
            html = applyPreloadCSS(html);
          }

          resolve(
            cors(
              request,
              new Response(html, {
                status: responseStatusCode,
                headers: responseHeaders,
              }),
            ),
          );
        });

        pipe(body);
      },
      onShellError(error: unknown) {
        reject(error);
      },
      onError(error: unknown) {
        console.error("renderToReadableStream error");
        console.error(error);

        responseStatusCode = 500;
        if (shellRendered) console.error(error);
      },
    });

    setTimeout(() => abort(), ABORT_DELAY);
  });
};

export function applyPreloadScripts(html: string) {
  const preloaded = [...html.matchAll(/<link[^>]+rel="preload"[^>]+href="([^"]+\.js)"/g)].map((m) => m[1]);
  const modulePreloaded = [...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g)].map((m) => m[1]);
  const missing = [...(html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] || "").matchAll(/\/assets\/[\w.-]+\.js/g)].map((m) => m[0]);
  const assets = [...new Set([...preloaded, ...modulePreloaded, ...missing])];
  const links = assets.map((asset) => `<link rel="modulepreload" href="${asset}" as="script"/>`).join("");

  html = html.replace(/<link[^>]+rel="modulepreload"[^>]+href="[^"]+\.js"[^>]*>/g, "");
  html = html.replace(/<\/head>/, `${links}</head>`);
  html = html.replace(/\s*(nonce|async)=""(?=\s|>)/g, " $1");
  html = html.replace(/<script(?![^>]*\b(?:async|defer)\b)([^>]*)>/g, "<script$1 async>");

  return html;
}

export function applyPreloadCSS(html: string) {
  const preloaded = [...html.matchAll(/<link[^>]+rel="preload"[^>]+href="([^"]+\.css)"/g)].map((m) => m[1]);
  const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/g)].map((m) => m[1]);
  const missing = [...(html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] || "").matchAll(/\/assets\/[\w.-]+\.css/g)].map((m) => m[0]);
  const assets = [...new Set([...preloaded, ...styles, ...missing])];
  let links = assets.map((asset) => `<link rel="preload" href="${asset}" as="style"/>`).join("");
  links += assets.map((asset) => `<link rel="stylesheet" href="${asset}"/>`).join("");

  html = html.replace(/<link[^>]+rel="preload"[^>]+href="[^"]+\.css"[^>]*>/g, "");
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="[^"]+\.css"[^>]*>/g, "");
  html = html.replace(/<\/head>/, `${links}</head>`);

  return html;
}

export default handleDocumentRequest;
