import { Outlet } from "@remix-run/react";
import customStyles from "../styles/custom.css";
import fontStyles from "../styles/fonts.css";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
      integrity: "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css",
    },
    { rel: "stylesheet", href: customStyles },
    { rel: "stylesheet", href: fontStyles },
  ];
};

// This layout is mostly used to isolate the marketing css stuff from the rest of the app.
export default function Marketing() {
  return <Outlet />;
}
