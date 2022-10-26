import { Search16 } from "@carbon/icons-react";
import { Input, Pagination, Select, Title, Text, Button, Center, Divider } from "@mantine/core";
import { Form, useSubmit } from "@remix-run/react";
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
    <div className="mx-auto container">
      <section className="flex flex-col space-y-7 md:flex-row md:space-y-0 py-12">
        <main className="flex-1">
          <div className="space-y-3">
            <Title order={2}>Brainstorm Marketplaces</Title>
            <Text color="dimmed" className="max-w-2xl">
              Brainstorm marketplaces empower our community to crowdsource the best questions for crypto analysts to
              answer. Participants can host, incentivize, and engage in brainstorms for any web3 topic.
            </Text>
          </div>
        </main>
        <aside className="md:w-1/5">
          <Center>
            <Button radius="md" className="mx-auto">
              Create Marketplace
            </Button>
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

      <section className="flex flex-col-reverse space-y-reverse space-y-7 md:space-y-0 md:flex-row">
        <main className="flex-1">
          <MarketplacesGrid marketplaces={marketplaces} />
          <Pagination page={pageNumber} onChange={onPaginationChange} total={totalPages} />
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
          </Form>
        </aside>
      </section>
    </div>
  );
}

function MarketplacesGrid({ marketplaces }: { marketplaces: Marketplace[] }) {
  return (
    <>
      <div className="flex overflow-auto">
        <div className="basis-2/6">Title</div>
        <div className="basis-1/6">Chain/Project</div>
        <div className="basis-1/6">Reward Pool</div>
        <div className="basis-1/6">Entry to Submit</div>
        <div className="basis-1/6">Topics</div>
      </div>
      {marketplaces.map((m) => {
        return (
          <div className="flex overflow-auto" key={m.id}>
            <div className="basis-2/6">{m.title}</div>
            <div className="basis-1/6">{m.project}</div>
            <div className="basis-1/6">{m.rewardPool}</div>
            <div className="basis-1/6">{m.entryCost}</div>
            <div className="basis-1/6">{m.topicCount}</div>
          </div>
        );
      })}
    </>
  );
}
