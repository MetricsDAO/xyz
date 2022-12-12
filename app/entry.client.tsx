import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

// Polyfills https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-remix/app/polyfills.ts
import { Buffer } from "buffer-polyfill";
window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

hydrate(<RemixBrowser />, document);
