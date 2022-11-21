import { ChevronSort16, ChevronSortDown16, ChevronSortUp16 } from "@carbon/icons-react";
import { Link, useSearchParams, useSubmit } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { countLaborMarkets, searchLaborMarkets } from "~/services/labor-market.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { getParamsOrFail } from "remix-params-helper";
import { LaborMarketSearchSchema } from "~/domain/labor-market";
import { ProjectBadge } from "~/components/ProjectBadge";
import { Button } from "~/components/button";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { Pagination } from "~/components/Pagination";
import { Combobox } from "~/components/Combobox";
import { useCallback, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { TokenBadge } from "~/components/TokenBadge";

export const loader = async (data: DataFunctionArgs) => {
  const url = new URL(data.request.url);
  url.searchParams.set("type", "brainstorm");
  const params = getParamsOrFail(url.searchParams, LaborMarketSearchSchema);
  const marketplaces = await searchLaborMarkets(params);
  const totalResults = await countLaborMarkets(params);
  return typedjson({ marketplaces, totalResults, params }, { status: 200 });
};

export default function Brainstorm() {
  const { marketplaces, totalResults, params } = useTypedLoaderData<typeof loader>();

  return (
    <div className="mx-auto container space-y-7 px-3 mb-10">
      <section className="flex flex-col md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl font-semibold">Challenge Marketplaces</h1>
            <p className="text-lg text-cyan-500">
              Crowdsource the best questions for crypto analysts to answer about any web3 topic
            </p>
            <p className="text-[#666666]">
              Jump into challenge marketplaces to launch or discover brainstorm challenges. Join challenges to submit
              your best question ideas or review peers' submissions to surface and reward winners
            </p>
          </div>
        </main>
        <aside className="md:w-1/4">
          <Link to="/app/brainstorm/new">
            <Button className="mx-auto">Create Marketplace</Button>
          </Link>
        </aside>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">
          Challenge Marketplaces <span className="text-[#A5A5A5]">({totalResults})</span>
        </h2>
        {/* Divider */}
        <div className="border-b-2 border-b-[#EDEDED]" />
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesTable marketplaces={marketplaces} />
            <div className="w-fit m-auto">
              <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
            </div>
          </div>
        </main>
        <aside className="md:w-1/4">
          <SearchAndFilter />
        </aside>
      </section>
    </div>
  );
}

function SearchAndFilter() {
  const submit = useSubmit();
  const ref = useRef<HTMLFormElement>(null);

  const memoizedSubmit = useCallback(() => {
    submit(ref.current);
  }, [submit]);

  return (
    <ValidatedForm
      formRef={ref}
      method="get"
      noValidate
      validator={withZod(z.any())}
      className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5"
    >
      <Input
        onChange={(e) => submit(e.currentTarget.form)}
        placeholder="Search"
        name="q"
        iconLeft={<MagnifyingGlassIcon className="w-5 h-5" />}
      />
      <h3 className="md:hidden font-semibold text-lg">Sort:</h3>
      <div className="md:hidden">
        <Select
          placeholder="Select option"
          name="sortBy"
          options={[
            { label: "None", value: "none" },
            { label: "Chain/Project", value: "project" },
          ]}
        />
      </div>
      <h3 className="font-semibold text-lg">Filter:</h3>
      <Combobox
        onChange={memoizedSubmit}
        label="I am able to"
        placeholder="Select option"
        name="filter"
        options={[
          { value: "launch", label: "Launch" },
          { value: "submit", label: "Submit" },
          { value: "review", label: "Review" },
        ]}
      />
      <Combobox
        onChange={memoizedSubmit}
        label="Reward Token"
        placeholder="Select option"
        name="rewardToken"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
      <Combobox
        onChange={memoizedSubmit}
        label="Chain/Project"
        placeholder="Select option"
        name="chainProject"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
        ]}
      />
    </ValidatedForm>
  );
}

type MarketplaceTableProps = {
  marketplaces: UseDataFunctionReturn<typeof loader>["marketplaces"];
};

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function MarketplacesTable({ marketplaces }: MarketplaceTableProps) {
  if (marketplaces.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }
  return (
    <div>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2 lg:mb-3">
        <div className="col-span-2">
          <SortButton label="title" title="Challenge Marketplace" />
        </div>
        <p>Chain/Project</p>
        <p>Challenge Pool Totals</p>
        <p>Avg. Challenge Pool</p>
        <SortButton label="serviceRequests" title="# Challenges" />
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {marketplaces.map((m) => {
          return (
            <Link
              to={`/app/brainstorm/${m.address}/challenges`}
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={m.address}
            >
              <div className="lg:hidden">Challenge Marketplaces</div>
              <div className="lg:col-span-2">{m.title}</div>

              <div className="lg:hidden">Chain/Project</div>
              <div>
                {m.projects.map((p) => (
                  <ProjectBadge key={p.slug} project={p} />
                ))}
              </div>

              <div className="lg:hidden">Challenge Pool Totals</div>
              <TokenBadge token={{ symbol: "usd", name: "USD" }} value={1000} />

              <div className="lg:hidden">Avg. Challenge Pool</div>
              <TokenBadge token={{ symbol: "usd", name: "USD" }} value={10000} />

              <div className="lg:hidden"># Challenges</div>
              <div>{m._count.serviceRequests.toLocaleString()}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SortButton({ label, title }: { label: string; title: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const onSort = (header: string) => {
    searchParams.set("sortBy", header);
    if (searchParams.get("order") === "asc") {
      searchParams.set("order", "desc");
    } else {
      searchParams.set("order", "asc");
    }
    setSearchParams(searchParams);
  };

  return (
    <button onClick={() => onSort(label)} className="flex">
      <p>{title}</p>
      {searchParams.get("sortBy") === label ? (
        searchParams.get("order") === "asc" ? (
          <ChevronSortUp16 className="mt-2" />
        ) : (
          <ChevronSortDown16 />
        )
      ) : (
        <ChevronSort16 className="mt-1" />
      )}
    </button>
  );
}
