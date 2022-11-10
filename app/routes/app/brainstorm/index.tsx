import { ChevronSort16, ChevronSortDown16, ChevronSortUp16, Search16 } from "@carbon/icons-react";
import {
  Input,
  Pagination,
  Select,
  Title,
  Text,
  Button,
  Center,
  Divider,
  MultiSelect,
  UnstyledButton,
} from "@mantine/core";
import { Form, Link, useSearchParams } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { countLaborMarkets, searchLaborMarkets } from "~/services/marketplace-service.server";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { getParamsOrFail } from "remix-params-helper";
import { LaborMarketSearchSchema } from "~/domain/labor-market";
import { ProjectBadge, TextWithIcon } from "~/components/ProjectBadge";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const onPaginationChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto container space-y-7 px-3 mb-10">
      <section className="flex flex-col md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <div className="space-y-5 max-w-3xl">
            <Title order={1}>Challenge Marketplaces</Title>
            <div className="space-y-2">
              <Text size="lg" color="brand.4">
                Crowdsource the best questions for crypto analysts to answer about any web3 topic
              </Text>
              <Text color="dimmed">
                Jump into challenge marketplaces to launch or discover brainstorm challenges. Join challenges to submit
                your best question ideas or review peers' submissions to surface and reward winners
              </Text>
            </div>
          </div>
        </main>
        <aside className="md:w-1/5">
          <Center>
            <Link to="/app/brainstorm/new">
              <Button radius="md" className="mx-auto">
                Create Marketplace
              </Button>
            </Link>
          </Center>
        </aside>
      </section>

      <section>
        <Title order={3}>
          Challenge Marketplaces
          <Text span color="dimmed">
            ({totalResults})
          </Text>
        </Title>
        <Divider />
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesTable marketplaces={marketplaces} />
            <div className="w-fit m-auto">
              <Pagination
                page={params.page}
                hidden={totalResults === 0}
                total={Math.ceil(totalResults / params.first)}
                onChange={onPaginationChange}
              />
            </div>
          </div>
        </main>
        <aside className="md:w-1/5">
          <SearchAndFilter />
        </aside>
      </section>
    </div>
  );
}

function SearchAndFilter() {
  return (
    <Form className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5">
      <Input radius="md" placeholder="Search" name="q" rightSection={<Search16 />} />
      <Text size="lg" weight={600} className="md:hidden">
        Sort:
      </Text>
      <Select
        radius="md"
        placeholder="Select option"
        name="sortBy"
        className="md:hidden"
        clearable
        data={[{ label: "Chain/Project", value: "project" }]}
      />
      <Text size="lg" weight={600}>
        Filter:
      </Text>
      <MultiSelect
        radius="md"
        label="I am able to"
        placeholder="Select option"
        name="filter"
        clearable
        data={[
          { value: "launch", label: "Launch" },
          { value: "submit", label: "Submit" },
          { value: "review", label: "Review" },
        ]}
      />
      <MultiSelect
        radius="md"
        label="Reward Token"
        placeholder="Select option"
        name="rewardToken"
        clearable
        data={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
      <MultiSelect
        radius="md"
        label="Chain/Project"
        placeholder="Select option"
        name="chainProject"
        clearable
        data={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
        ]}
      />
      <Button radius="md" variant="light" size="xs" type="submit">
        Apply Filters
      </Button>
    </Form>
  );
}

type MarketplaceTableProps = {
  marketplaces: UseDataFunctionReturn<typeof loader>["marketplaces"];
};

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function MarketplacesTable({ marketplaces }: MarketplaceTableProps) {
  if (marketplaces.length === 0) {
    return <Text>No results. Try changing search and filter options.</Text>;
  }
  return (
    <>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <div className="col-span-2">
          <SortButton label="title" title="Challenge Marketplace" />
        </div>
        <UnstyledButton>
          <Text color="dark.3">Chain/Project</Text>
        </UnstyledButton>
        <UnstyledButton>
          <Text color="dark.3">Challenge Pool Totals</Text>
        </UnstyledButton>
        <UnstyledButton>
          <Text color="dark.3">Avg. Challenge Pool</Text>
        </UnstyledButton>
        <SortButton label="serviceRequests" title="# Challenges" />
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {marketplaces.map((m) => {
          return (
            <Link
              to="/app/brainstorm/[marketplaceId]/challenges"
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={m.address}
            >
              <div className="lg:hidden">Challenge Marketplaces</div>
              <div className="lg:col-span-2">
                <Text>{m.title}</Text>
              </div>
              <div className="lg:hidden">Chain/Project</div>
              <div>
                {m.projects.map((p) => (
                  <ProjectBadge key={p.slug} slug={p.slug} />
                ))}
              </div>
              <div className="lg:hidden">Challenge Pool Totals</div>
              <TextWithIcon text={`42000 USD`} iconUrl="/img/icons/dollar.svg" />
              <div className="lg:hidden">Avg. Challenge Pool</div>
              <TextWithIcon text={`42000 USD`} iconUrl="/img/icons/dollar.svg" />
              <div className="lg:hidden"># Challenges</div>
              <Text color="dark.3">{m._count.serviceRequests.toLocaleString()}</Text>
            </Link>
          );
        })}
      </div>
    </>
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
    <UnstyledButton onClick={() => onSort(label)} className="flex">
      <Text color="dark.3">{title}</Text>
      {searchParams.get("sortBy") === label ? (
        searchParams.get("order") === "asc" ? (
          <ChevronSortUp16 className="mt-2" />
        ) : (
          <ChevronSortDown16 />
        )
      ) : (
        <ChevronSort16 className="mt-1" />
      )}
    </UnstyledButton>
  );
}
