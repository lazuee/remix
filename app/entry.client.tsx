import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { RemixBrowser } from "@remix-run/react";
import { cacheAssets } from "remix-utils/cache-assets";

async function hydrate() {
  cacheAssets({ buildPath: "/assets/" }).catch(console.error);
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
