import { Outlet } from "@remix-run/react";
import { Shell } from "~/components/Shell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
import rainbowKitStyles from "@rainbow-me/rainbowkit/styles.css";
import styles from "../styles/app.css";

const queryClient = new QueryClient();

// Need to reference Tailwind styles from here because marketing pages need them to come after Bootstrap.
// We don't want Bootstrap in our app/ pages, so we can't just do this in the root
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: rainbowKitStyles },
    { rel: "stylesheet", href: styles },
  ];
};
export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <Shell>
        <Outlet />
      </Shell>
    </QueryClientProvider>
  );
}
