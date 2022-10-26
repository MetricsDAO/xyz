import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "@remix-run/react";
import { useEffect } from "react";
import type { LinksFunction, MetaFunction } from "@remix-run/react/dist/routeModules";
import WalletProvider from "./components/WalletProvider";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import styles from "./styles/app.css";
import rainbowKitStyles from "@rainbow-me/rainbowkit/styles.css";

createEmotionCache({ key: "mantine" });

export const meta: MetaFunction = () => {
  return {
    title: "MetricsDAO",
    viewport: "width=device-width, initial-scale=1.0",
    charSet: "utf-8",
    httpEquiv: "X-UA-Compatible",
    content: "IE=edge",
    description: "Uniting the best analytical minds in the space to build the future of crypto analytics.",
    "og:image": "https://metricsdao.xyz/img/social.png",
    "og:description": "Uniting the best analytical minds in the space to build the future of crypto analytics.",
    "og:url": "https://metricsdao.xyz",
    "og:title": "Metrics DAO",
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:domain": "metricsdao.xyz",
    "twitter:url": "https://metricsdao.xyz",
    "twitter:title": "Metrics DAO",
    "twitter:description": "Uniting the best analytical minds in the space to build the future of crypto analytics.",
    "twitter:image": "https://metricsdao.xyz/img/social.png",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "img/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/img/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/img/favicon-16x16.png",
    },
    {
      rel: "shortcut icon",
      href: "/img/favicon.ico",
    },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: rainbowKitStyles },
  ];
};

export function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => console.error(error), [error]);
  return (
    <Document title="Error!">
      <div className="container mx-auto space-y-3 my-6 bg-[#E6E6E6] rounded-lg p-10 shadow-xl">
        <h1 className="text-5xl">Uh oh, something broke.</h1>
        {error.message ? <p className="hidden">{error.message}</p> : <></>}
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 404:
      message = "Oops! Looks like you tried to visit a page that does not exist.";
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="container mx-auto space-y-3 my-6 bg-[#E6E6E6] rounded-lg p-10 shadow-xl">
        <h1 className="text-5xl">
          {caught.status} {caught.statusText}
        </h1>
        <p className="text-lg text-zinc-500">{message}</p>
      </div>
    </Document>
  );
}

export default function App() {
  return (
    <Document>
      <WalletProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Outlet />
        </MantineProvider>
      </WalletProvider>
    </Document>
  );
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <html lang="en">
      <head>
        <StylesPlaceholder />
        {title ? <title>{title}</title> : null}
        <Links />
        <Meta />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8JJWLXT88P"></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `            
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-8JJWLXT88P');
        `,
          }}
        ></script>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
