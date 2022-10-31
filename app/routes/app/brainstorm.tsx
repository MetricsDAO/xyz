import { Search16 } from "@carbon/icons-react";
import { Input, Pagination, Select, Title, Text, Button, Center, Divider, MultiSelect, Avatar } from "@mantine/core";
import { Form, Link, useSearchParams } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { Marketplace } from "~/domain";
import { withServices } from "~/services/with-services.server";
import { PROJECT_ICONS } from "~/utils/helpers";

export const loader = async (data: DataFunctionArgs) => {
  return withServices(data, async ({ marketplace }) => {
    return typedjson(marketplace.brainstormMarketplaces());
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
    <div className="mx-auto container px-3">
      <section className="flex flex-col md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5 py-12">
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

      <section className="pb-7">
        <Title order={3}>
          Challenge Marketplaces{" "}
          <Text span color="dimmed">
            ({totalResults})
          </Text>{" "}
        </Title>
        <Divider />
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <MarketplacesTable marketplaces={marketplaces} />
            <div className="w-fit m-auto">
              <Pagination page={pageNumber} onChange={onPaginationChange} total={totalPages} />
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
    <Form className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-[#94CAFF] bg-opacity-5">
      <Input placeholder="Search" name="search" rightSection={<Search16 />} />
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

function MarketplacesTable({ marketplaces }: { marketplaces: Marketplace[] }) {
  return (
    <div className="overflow-auto">
      <div className="w-full border-spacing-4 border-separate">
        <div className="flex items-center space-x-2 text-left px-4">
          <div className="w-2/6">
            <Text color="dark.3">Challenge Marketplace</Text>
          </div>
          <div className="w-1/6">
            <Text color="dark.3">Chain/Project</Text>
          </div>
          <div className="w-1/6">
            <Text color="dark.3">Challenge Pool Totals</Text>
          </div>
          <div className="w-1/6">
            <Text color="dark.3">Avg. Challenge Pool</Text>
          </div>
          <div className="w-1/6">
            <Text color="dark.3"># Challenges</Text>
          </div>
        </div>
        <div className="space-y-4">
          {marketplaces.map((m) => {
            return (
              <Link
                to="/app/m/[marketplaceId]"
                className="flex items-center space-x-2 border-solid border-2 border-[#EDEDED] py-5 px-4 rounded-lg hover:border-[#16ABDD66] hover:shadow-md shadow-sm"
                key={m.id}
              >
                <div className="w-2/6">
                  <Text>{m.title}</Text>
                </div>
                <div className="w-1/6">
                  <ProjectWithIcon project={m.project} />
                </div>
                <div className="w-1/6">
                  <TextWithIcon text={`${m.rewardPool} USD`} iconUrl="/img/icons/dollar.svg" />
                </div>
                <div className="w-1/6">
                  <TextWithIcon text={`${m.entryCost} USD`} iconUrl="/img/icons/dollar.svg" />
                </div>
                <div className="w-1/6">
                  <Text color="dark.3">{m.topicCount}</Text>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
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
