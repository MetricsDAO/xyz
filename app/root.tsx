import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/react/dist/routeModules";
import WalletProvider from "~/contexts/wallet-provider";
import styles from "./styles/app.css";
import rainbowKitStyles from "@rainbow-me/rainbowkit/styles.css";
import mdEditorStyles from "@uiw/react-md-editor/dist/mdeditor.min.css";
import { getUser } from "./services/session.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { Toaster } from "react-hot-toast";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import env from "./env.server";
import { Blurs } from "./features/shell";
import { Error as ErrorBoundary } from "./components/error-boundary";
import { withSentry } from "@sentry/remix";
import { listProjects } from "./services/projects.server";
import { listTokens } from "./services/tokens.server";
import { getContracts } from "./utils/contracts.server";
import { findAllWalletsForUser } from "./services/wallet.server";

// add types for window.ENV
declare global {
  interface Window {
    ENV: {
      [key: string]: string;
    };
  }
}

export async function loader({ request }: DataFunctionArgs) {
  const user = await getUser(request);
  const wallets = user ? await findAllWalletsForUser(user.id) : [];
  const projects = await listProjects();
  const tokens = await listTokens();
  const contracts = getContracts();
  return typedjson({
    user,
    wallets,
    projects,
    tokens,
    contracts,
    ENV: {
      ENVIRONMNET: env.ENVIRONMENT,
      SENTRY_DSN: env.SENTRY_DSN,
      TREASURY_URL: env.TREASURY_URL,
    },
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "MetricsDAO | The DAO for Web3 Data Analytics",
    viewport: "width=device-width, initial-scale=1.0",
    charSet: "utf-8",
    httpEquiv: "X-UA-Compatible",
    content: "IE=edge",
    description: "Connecting projects with the best analysts in Web3 for all data needs.",
    "og:image": "https://metricsdao.xyz/img/social.png",
    "og:description": "Connecting projects with the best analysts in Web3 for all data needs.",
    "og:url": "https://metricsdao.xyz",
    "og:title": "MetricsDAO | The DAO for Web3 Data Analytics",
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:domain": "metricsdao.xyz",
    "twitter:url": "https://metricsdao.xyz",
    "twitter:title": "MetricsDAO | The DAO for Web3 Data Analytics",
    "twitter:description": "Connecting projects with the best analysts in Web3 for all data needs.",
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
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
      as: "style",
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
    { rel: "stylesheet", href: mdEditorStyles },
  ];
};

// export function ErrorBoundary({ error }: { error: Error }) {
//   return (
//     <html lang="en">
//       <head>
//         <title>Oh no...</title>
//         <Links />
//       </head>
//       <body>
//         <div className="w-screen h-screen flex items-center justify-center">
//           <Blurs />
//           <Error error={error} />
//         </div>
//         <Scripts />
//       </body>
//     </html>
//   );
// }

function App() {
  const { user, ENV } = useTypedLoaderData<typeof loader>();
  const authStatus = user ? "authenticated" : "unauthenticated";

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
        <WalletProvider authStatus={authStatus}>
          <Outlet />
        </WalletProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

export default withSentry(App, {
  errorBoundaryOptions: {
    fallback: <ErrorBoundary />,
  },
});
