import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "@remix-run/react";
import WalletProvider from "./components/WalletProvider";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";

createEmotionCache({ key: "mantine" });

export default function App() {
  return (
    <Document>
      <WalletProvider>
        <Outlet />
      </WalletProvider>
    </Document>
  );
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          brand: [
            "#dbfaff",
            "#b1e9fc",
            "#86daf5",
            "#59caf0",
            "#2ebbea",
            "#15a1d1",
            "#037ea3",
            "#005a76",
            "#00374a",
            "#00141d",
          ],
        },
        primaryColor: "brand",
        fontFamily: "Inter, sans-serif",
        headings: {
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
        },
      }}
    >
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
    </MantineProvider>
  );
}
