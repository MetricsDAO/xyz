import { Outlet, useCatch } from "@remix-run/react";
import { Shell } from "~/components/Shell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Prevent Mantine styles from being removed when reaching a 404 page (https://github.com/remix-run/remix/issues/1136#issuecomment-1255452202)
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

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <Shell>
        <Outlet />
      </Shell>
    </QueryClientProvider>
  );
}
