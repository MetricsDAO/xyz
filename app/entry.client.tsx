import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
// Polyfills https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-remix/app/polyfills.ts
import { Buffer } from "buffer-polyfill";
import * as Sentry from "@sentry/remix";

if (window.ENV.SENTRY_DSN) {
  Sentry.init({
    dsn: window.ENV.SENTRY_DSN,
    environment: window.ENV.ENVIRONMENT,
    tracesSampleRate: 1,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(useEffect, useLocation, useMatches),
      }),
    ],
  });
}

window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
