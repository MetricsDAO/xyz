import { Outlet, useCatch } from "@remix-run/react";
import customStyles from "../../styles/custom.css";
import fontStyles from "../../styles/fonts.css";
import aosStyles from "aos/dist/aos.css";
import algoliaStyles from "../../styles/algolia.css";
import type { LinksFunction } from "@remix-run/react/dist/routeModules";
import { useEffect } from "react";

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
    { rel: "stylesheet", href: aosStyles },
    { rel: "stylesheet", href: algoliaStyles },
    // hack to include Tailwind base styles (https://tailwindcss.com/docs/preflight). We don't want base styles on app side.
    { rel: "stylesheet", href: "https://unpkg.com/tailwindcss@3.2.1/src/css/preflight.css" },
  ];
};

// This layout is mostly used to isolate the marketing css stuff from the rest of the app.
export default function Marketing() {
  return <Outlet />;
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
    <div className="container mx-auto space-y-3 my-6 bg-[#E6E6E6] rounded-lg p-10 shadow-xl">
      <h1 className="text-5xl">
        {caught.status} {caught.statusText}
      </h1>
      <p className="text-lg text-zinc-500">{message}</p>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="container mx-auto space-y-3 my-6 bg-[#E6E6E6] rounded-lg p-10 shadow-xl">
      <h1 className="text-5xl">Uh oh, something broke.</h1>
      {error.message ? <p className="hidden">{error.message}</p> : <></>}
    </div>
  );
}
