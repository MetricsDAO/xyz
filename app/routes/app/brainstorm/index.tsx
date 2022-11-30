import { ChevronSort16, ChevronSortDown16, ChevronSortUp16 } from "@carbon/icons-react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Link, useSearchParams } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useCallback, useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/button";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/checkbox";
import { Combobox } from "~/components/combobox";
import { Container } from "~/components/Container";
import { Field, Label } from "~/components/field";
import { Input } from "~/components/input";
import { Pagination } from "~/components/Pagination";
import { ProjectIcon } from "~/components/project-icon/project-icon";
import { ValidatedSelect } from "~/components/select";
import { TokenIcon } from "~/components/token-icon/token-icon";
import { LaborMarketSearchSchema } from "~/domain/labor-market";
import { countLaborMarkets, searchLaborMarkets } from "~/services/labor-market.server";
import { useUpdateSearchParams } from "~/utils/use-update-search-params";

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
    <Container className="py-16">
      <header className="flex flex-col justify-between md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5 mb-20">
        <main className="flex-1 space-y-3 max-w-2xl">
          <h1 className="text-3xl font-semibold">Challenge Marketplaces</h1>
          <p className="text-lg text-cyan-500">
            Crowdsource the best questions for crypto analysts to answer about any web3 topic
          </p>
          <p className="text-gray-500 text-sm">
            Jump into challenge marketplaces to launch or discover brainstorm challenges. Join challenges to submit your
            best question ideas or review peers' submissions to surface and reward winners
          </p>
        </main>
        <aside>
          <Button size="lg" asChild>
            <Link to="/app/brainstorm/new">Create Marketplace</Link>
          </Button>
        </aside>
      </header>

      <h2 className="text-lg font-semibold border-b border-gray-200 py-4 mb-6">
        Challenge Marketplaces <span className="text-gray-400">({totalResults})</span>
      </h2>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesTable marketplaces={marketplaces} />
            <div className="w-fit m-auto">
              <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
            </div>
          </div>
        </main>
        <aside className="md:w-1/5">
          <SearchAndFilter />
        </aside>
      </section>
    </Container>
  );
}

function SearchAndFilter() {
  const ref = useRef<HTMLFormElement>(null);
  const updateParams = useUpdateSearchParams();
  const handleChange = useCallback(() => {
    if (ref.current) {
      updateParams(new FormData(ref.current));
    }
  }, [updateParams]);

  return (
    <ValidatedForm
      formRef={ref}
      method="get"
      noValidate
      validator={withZod(z.any())}
      onChange={handleChange}
      className="space-y-3 p-4 border border-gray-300/50 rounded-lg bg-brand-400 bg-opacity-5 text-sm"
    >
      <Input
        placeholder="Search"
        name="q"
        size="sm"
        iconRight={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      />

      <Field>
        <Label className="font-semibold">Sort by</Label>
        <ValidatedSelect
          placeholder="Select option"
          name="sortBy"
          size="sm"
          onChange={handleChange}
          options={[
            { label: "Trending", value: "trending" },
            { label: "# Challenges", value: "serviceRequests" },
            { label: "Chain/Project", value: "project" },
          ]}
        />
      </Field>

      <h3 className="font-semibold">Filter:</h3>
      <p className="text-gray-600">I'm able to:</p>
      <Checkbox name="can" label="Launch" value="launch" />
      <Checkbox name="can" label="Submit" value="submit" />
      <Checkbox name="can" label="Review" value="review" />

      <Combobox
        placeholder="Select option"
        size="sm"
        options={[
          { value: "launch", label: "Launch" },
          { value: "submit", label: "Submit" },
          { value: "review", label: "Review" },
        ]}
      />

      <Field>
        <Label>Reward Token</Label>
        <Combobox
          onChange={handleChange}
          placeholder="Select option"
          size="sm"
          options={[
            { label: "Solana", value: "Solana" },
            { label: "Ethereum", value: "Ethereum" },
            { label: "USD", value: "USD" },
          ]}
        />
      </Field>

      <Field>
        <Label>Chain/Project</Label>
        <Combobox
          onChange={handleChange}
          placeholder="Select option"
          options={[
            { label: "Solana", value: "Solana" },
            { label: "Ethereum", value: "Ethereum" },
          ]}
        />
      </Field>
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
      <div className="hidden text-xs text-gray-500 font-medium lg:grid grid-cols-6 gap-x-1 items-end px-2 lg:mb-3">
        <div className="col-span-2">
          <SortButton label="title" title="Challenge Marketplace" />
        </div>
        <p>Chain/Project</p>
        <p>Challenge Pool Totals</p>
        <p>Avg. Challenge Pool</p>
        <SortButton label="serviceRequests" title="# Challenges" />
      </div>
      {/* Rows */}
      <div className="space-y-4">
        {marketplaces.map((m) => {
          return (
            <Card asChild key={m.address}>
              <Link
                to={`/app/brainstorm/${m.address}/challenges`}
                // On mobile, two column grid with "labels". On desktop hide the "labels".
                className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center px-4 py-5"
              >
                <div className="lg:hidden">Challenge Marketplaces</div>
                <div className="lg:col-span-2 text-sm font-medium">{m.title}</div>

                <div className="lg:hidden">Chain/Project</div>
                <div className="flex flex-wrap gap-2">
                  {m.projects.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectIcon project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                </div>

                <div className="lg:hidden">Challenge Pool Totals</div>
                <Badge>
                  <TokenIcon token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>

                <div className="lg:hidden">Avg. Challenge Pool</div>
                <Badge>
                  <TokenIcon token={{ symbol: "usdc", name: "USDC" }} />
                  <span className="mx-1">1000 USDC</span>
                </Badge>

                <div className="lg:hidden"># Challenges</div>
                <div>{m._count.serviceRequests.toLocaleString()}</div>
              </Link>
            </Card>
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
