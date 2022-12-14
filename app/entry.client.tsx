import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";
// Polyfills https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-remix/app/polyfills.ts
import { Buffer } from "buffer-polyfill";

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

hydrate(<RemixBrowser />, document);
