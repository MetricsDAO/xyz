import { Search16 } from "@carbon/icons-react";
import { Input, Pagination, Select } from "@mantine/core";
import { Form, useSearchParams, useSubmit } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useRef } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Button } from "~/components/Button";
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

  // Get the current page from the params so we can persist it through filter changes
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  // Form submission on change.
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  function handleChange() {
    submit(formRef.current);
  }

  return (
    <section className="mx-auto container">
      <header className="">
        <h3 className="text-2xl font-semibold">Brainstorm Marketplaces</h3>
        <p className="max-w-2xl">
          Brainstorm marketplaces empower our community to crowdsource the best questions for crypto analysts to answer.
          Participants can host, incentivize, and engage in brainstorms for any web3 topic.
        </p>
      </header>

      <div className="flex flex-col-reverse md:flex-row">
        <main className="flex-1">
          <MarketplacesGrid marketplaces={marketplaces} />
          <Pagination page={pageNumber} onChange={onPaginationChange} total={totalPages} />
        </main>

        <Form className="md:w-1/5 space-y-5" onChange={handleChange} ref={formRef}>
          {page ? <input type="hidden" name="page" value={page} /> : null}
          <Button fullWidth>New Marketplace</Button>
          <Input placeholder="Search" name="search" icon={<Search16 />} />
          <Select
            label="Sort By"
            placeholder="Select option"
            name="sortBy"
            onChange={handleChange}
            clearable
            data={[{ label: "Chain/Project", value: "project" }]}
          />
        </Form>
      </div>
    </section>
  );
}

function MarketplacesGrid({ marketplaces }: { marketplaces: Marketplace[] }) {
  return (
    <div className="grid grid-cols-6">
      <div className="col-span-2">Title</div>
      <div className="overflow-ellipsis overflow-hidden">Chain/Project</div>
      <div>Reward Pool</div>
      <div>Entry to Submit</div>
      <div>Topics</div>
      {marketplaces.map((m) => {
        return [
          <div key={`${m.id}-title`} className="col-span-2 overflow-ellipsis overflow-hidden">
            {m.title}
          </div>,
          <div key={`${m.id}-project`} className="overflow-ellipsis overflow-hidden">
            {m.project}
          </div>,
          <div key={`${m.id}-reward-pool`}>{m.rewardPool} USD</div>,
          <div key={`${m.id}-entry`}>{m.entryCost} xMetric</div>,
          <div key={`${m.id}-topic-count`}>{m.topicCount}</div>,
        ];
      })}
    </div>
  );
}
