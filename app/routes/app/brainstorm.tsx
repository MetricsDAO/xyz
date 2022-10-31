import { Search16 } from "@carbon/icons-react";
import { Input, Pagination, Select, Title, Text, Button, Center, Divider, Checkbox, MultiSelect } from "@mantine/core";
import { Form, Link, useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useRef } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { Marketplace } from "~/domain";
import { useQueryParams } from "~/hooks/useQueryParams";
import { withServices } from "~/services/with-services.server";

export const loader = async (data: DataFunctionArgs) => {
  return withServices(data, async ({ marketplace }) => {
    return typedjson(marketplace.brainstormMarketplaces());
  });
};

export default function Brainstorm() {
  const { data: marketplaces, pageNumber, totalPages } = useTypedLoaderData<typeof loader>();
  const [, setQueryParams] = useQueryParams();

  const onPaginationChange = (page: number) => {
    setQueryParams({ page: page === 1 ? null : page.toString() });
  };

  // Form submission on change.
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  function handleChange() {
    submit(formRef.current);
  }

  return (
    <div className="mx-auto container mb-12">
      <section className="flex flex-col md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5 py-12">
        <main className="flex-1">
          <div className="space-y-3">
            <Title order={2}>Brainstorm Marketplaces</Title>
            <Text color="dimmed" className="max-w-2xl">
              <Text span color="blue">
                Brainstorm marketplaces empower our community to host brainstorm challenges that crowdsource the best
                questions for crypto analysts to answer.
              </Text>{" "}
              Ways to participate: Sponsor brainstorm challenges for any web3 topic. Submit your best question ideas on
              challenges that interest you. Review peers’ question ideas to surface and reward challenge winners.
            </Text>
          </div>
        </main>
        <aside className="md:w-1/5">
          <Center>
            <Link to="/app/m/new">
              <Button radius="md" className="mx-auto">
                Create Marketplace
              </Button>
            </Link>
          </Center>
        </aside>
      </section>

      <section className="pb-7">
        <Title order={3}>
          Marketplaces{" "}
          <Text span color="dimmed">
            (25)
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
          <Form className="space-y-5" onChange={handleChange} ref={formRef}>
            <Input placeholder="Search" name="search" icon={<Search16 />} />
            <Select
              label="Sort By"
              placeholder="Select option"
              name="sortBy"
              clearable
              data={[{ label: "Chain/Project", value: "project" }]}
            />
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
            <Select
              label="Chain/Project"
              placeholder="Select option"
              name="chainProject"
              clearable
              data={[
                { label: "Solana", value: "Solana" },
                { label: "Ethereum", value: "Ethereum" },
              ]}
            />
            <Button variant="light" color="cyan" size="xs" onClick={handleChange}>
              Apply Filters
            </Button>
          </Form>
        </aside>
      </section>
    </div>
  );
}

function MarketplacesTable({ marketplaces }: { marketplaces: Marketplace[] }) {
  return (
    <div className="overflow-auto">
      <div className="min-w-[350px] w-full border-spacing-4 border-separate">
        <div className="flex items-center space-x-2 text-left px-4 text-[#666666]">
          <div className="w-2/6 font-normal overflow-hidden text-ellipsis">Brainstorm</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis">Chain/Project</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis">Potential Rewards</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis">Entry to Submit</div>
          <div className="w-1/6 font-normal overflow-hidden text-ellipsis"># Challenges</div>
        </div>
        <div className="space-y-4">
          {marketplaces.map((m) => {
            return (
              <Link
                to="/app/m/[marketplaceId]"
                className="flex space-x-2 border-solid border-2 border-[#EDEDED] py-5 px-4 rounded-lg hover:border-black"
                key={m.id}
              >
                <div className="w-2/6">{m.title}</div>
                <div className="w-1/6">{m.project}</div>
                <div className="w-1/6">{m.rewardPool} USD</div>
                <div className="w-1/6">{m.entryCost} xMetric</div>
                <div className="w-1/6">{m.topicCount}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
