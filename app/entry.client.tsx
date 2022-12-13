import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { H } from "highlight.run";

// Polyfills https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-remix/app/polyfills.ts
import { Buffer } from "buffer-polyfill";
window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

// @ts-ignore - We set ENV via the loader in root.tsx
H.init("memo69d2", { environment: window.ENV.ENVIRONMENT });

hydrate(<RemixBrowser />, document);
