import { Search16 } from "@carbon/icons-react";
import { Input, Pagination, Select, Title, Text, Button, Center, Divider, MultiSelect, Avatar } from "@mantine/core";
import { Form, Link, useSearchParams } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { Marketplace } from "~/domain";
import { withServices } from "~/services/with-services.server";
import { PROJECT_ICONS } from "~/utils/helpers";
import { getParamsOrFail } from "remix-params-helper";
import { LaborMarketSearchSchema } from "~/domain/labor-market";

export const loader = async (data: DataFunctionArgs) => {
  return withServices(data, async (svc) => {
    const url = new URL(data.request.url);
    const params = getParamsOrFail(url.searchParams, LaborMarketSearchSchema);
    return typedjson(svc.marketplace.brainstormMarketplaces(params));
  });
};

export default function Brainstorm() {
  const { data: marketplaces, pageNumber, totalPages, totalResults } = useTypedLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const onPaginationChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto container space-y-7 px-3 mt-5 mb-10">
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
            <Link to="/app/m/new">
              <Button radius="md" size="md">
                Create Marketplace
              </Button>
            </Link>
          </Center>
        </aside>
      </section>

      <section>
        <Title order={3}>
          Challenge Marketplaces{" "}
          <Text span color="dimmed">
            ({totalResults})
          </Text>
        </Title>
        <Divider />
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesTable marketplaces={marketplaces} />
            <div className="w-fit m-auto">
              <Pagination
                page={pageNumber}
                hidden={marketplaces.length === 0}
                onChange={onPaginationChange}
                total={totalPages}
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
      <Input placeholder="Search" name="q" rightSection={<Search16 />} />
      <Text size="lg" weight={600}>
        Sort:
      </Text>
      <Select
        placeholder="Select option"
        name="sortBy"
        clearable
        data={[{ label: "Chain/Project", value: "project" }]}
      />
      <Text size="lg" weight={600}>
        Filter:
      </Text>
      <MultiSelect
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
        label="Chain/Project"
        placeholder="Select option"
        name="chainProject"
        clearable
        data={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
        ]}
      />
      <Button variant="light" size="xs" type="submit">
        Apply Filters
      </Button>
    </Form>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function MarketplacesTable({ marketplaces }: { marketplaces: Marketplace[] }) {
  if (marketplaces.length === 0) {
    return <Text>No results. Try changing search and filter options.</Text>;
  }
  return (
    <>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <div className="col-span-2">
          <Text color="dark.3">Challenge Marketplace</Text>
        </div>
        <Text color="dark.3">Chain/Project</Text>
        <Text color="dark.3">Challenge Pool Totals</Text>
        <Text color="dark.3">Avg. Challenge Pool</Text>
        <Text color="dark.3"># Challenges</Text>
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {marketplaces.map((m) => {
          return (
            <Link
              to="/app/m/[marketplaceId]"
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={m.id}
            >
              <div className="lg:hidden">Challenge Marketplaces</div>
              <div className="lg:col-span-2">
                <Text>{m.title}</Text>
              </div>
              <div className="lg:hidden">Chain/Project</div>
              <ProjectWithIcon project={m.project} />
              <div className="lg:hidden">Challenge Pool Totals</div>
              <TextWithIcon text={`${m.rewardPool.toLocaleString()} USD`} iconUrl="/img/icons/dollar.svg" />
              <div className="lg:hidden">Avg. Challenge Pool</div>
              <TextWithIcon text={`${m.entryCost.toLocaleString()} USD`} iconUrl="/img/icons/dollar.svg" />
              <div className="lg:hidden"># Challenges</div>
              <Text color="dark.3">{m.topicCount.toLocaleString()}</Text>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function ProjectWithIcon({ project }: { project: string }) {
  const iconUrl = PROJECT_ICONS[project];

  return <TextWithIcon text={project} iconUrl={iconUrl ?? null} />;
}

function TextWithIcon({ text, iconUrl }: { text: string; iconUrl: string | null }) {
  return (
    <div className="flex items-center space-x-1">
      {iconUrl && <Avatar size="sm" src={iconUrl} />}
      <Text color="dark.3" weight={400}>
        {text}
      </Text>
    </div>
  );
}
