import { Link } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Button } from "~/components/Button";
import { Pagination } from "~/components/Pagination";
import type { Marketplace } from "~/domain";

export const loader = async ({ context, request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  return typedjson(context.marketplaces.brainstormMarketplaces({ page }));
};

export default function Brainstorm() {
  const { data: marketplaces, pageNumber, totalPages } = useTypedLoaderData<typeof loader>();
  return (
    <div className="flex">
      <main className="mx-auto container">
        <header className="pb-10 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Brainstorms</h3>
        </header>

        <div className="flex space-x-6">
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 flex-1">
              {marketplaces.map((marketplace) => (
                <MarketplaceCard key={marketplace.id} marketplace={marketplace} />
              ))}
            </div>
            <Pagination page={pageNumber} totalPages={totalPages} />
          </div>
          <aside className="w-1/5">
            <Button fullWidth>New Program</Button>
            filters
          </aside>
        </div>
      </main>
    </div>
  );
}

function MarketplaceCard({ marketplace }: { marketplace: Marketplace }) {
  return (
    <Link to="/brainstorm/id" className="rounded bg-neutral-100 p-5 flex flex-col space-y-2">
      <h4 className="text-lg font-semibold">{marketplace.title}</h4>
      <p className="text-sm text-neutral-500 text-ellipsis">{marketplace.description}</p>
      <p className="text-xs">Created By {marketplace.creator}</p>
      <p className="text-sm">42 Questions</p>
    </Link>
  );
}
