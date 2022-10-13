import customStyles from "./styles/custom.css";
import fontStyles from "./styles/fonts.css";
import AppFooter from "./components/Footer";
import styles from "./styles/app.css";
import algoliaStyles from "./styles/algolia.css";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/react/routeModules";

export const meta: MetaFunction = () => {
  return {
    title: "MetricsDAO",
    viewport: "width=device-width, initial-scale=1.0",
    charSet: "utf-8",
    httpEquiv: "X-UA-Compatible",
    content: "IE=edge",
    "og:image": "https://bounty.metricsdao.xyz/social/twitter/metricsdao_banner.png",
    "og:description": "Uniting the best analytical minds in the space to build the future of crypto analytics.",
    "og:url": "https://bounty.metricsdao.xyz",
    "og:title": "Metrics DAO",
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:domain": "metricsdao.xyz",
    "twitter:url": "https://metricsdao.xyz",
    "twitter:title": "Metrics DAO",
    "twitter:description": "Uniting the best analytical minds in the space to build the future of crypto analytics.",
    "twitter:image": "https://bounty.metricsdao.xyz/social/twitter/metricsdao_banner.png",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
      integrity: "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
      crossOrigin: "anonymous",
    },
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
      href: "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css",
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/aos@2.3.1/dist/aos.css",
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
      href: "img/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "img/favicon-16x16.png",
    },
    {
      rel: "shortcut icon",
      href: "img/favicon.ico",
    },
    { rel: "stylesheet", href: fontStyles },
    { rel: "stylesheet", href: customStyles },
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: algoliaStyles },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
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
        <Outlet />
        <AppFooter />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
