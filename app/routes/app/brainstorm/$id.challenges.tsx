import { Search16 } from "@carbon/icons-react";
import { Form, Link, useSearchParams } from "@remix-run/react";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { typedjson } from "remix-typedjson/dist/remix";
import { getParamsOrFail } from "remix-params-helper";
import { ChallengeSearchSchema } from "~/domain/challenge";
import { countChallenges, searchChallenges } from "~/services/challenges-service.server";
import { findLaborMarket } from "~/services/labor-market.server";
import { Tabs } from "~/components/Tabs";
import { Countdown } from "~/components/countdown";
import { Pagination } from "~/components/Pagination";
import { Button } from "~/components/button";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/Badge";

export const loader = async (data: DataFunctionArgs) => {
  const url = new URL(data.request.url);
  const params = getParamsOrFail(url.searchParams, ChallengeSearchSchema);

  if (params.laborMarket == undefined) {
    params.laborMarket = data.params.id;
  }

  let laborMarket = undefined;

  if (data.params.id != undefined) {
    laborMarket = await findLaborMarket(data.params.id);
  }

  const challenges = await searchChallenges(params);
  const totalResults = await countChallenges(params);
  return typedjson({ challenges, totalResults, params, laborMarket });
};

export default function MarketplaceChallenges() {
  const { laborMarket, challenges } = useTypedLoaderData<typeof loader>();

  return (
    <div className="mx-auto container mb-12 px-10">
      <section className="flex flex-wrap gap-5 justify-between pb-5">
        <div>{laborMarket?.title} </div>
        <div className="flex flex-wrap gap-5">
          <Link to="/app/brainstorm/[marketplaceId]/claim">
            <Button className="mx-auto radius-md">Launch Challenge</Button>
          </Link>
        </div>
      </section>
      <section className="flex flex-col space-y-7 pb-12">
        {/* <div className="flex flex-wrap gap-x-8">
          <Detail>
            <Detail.Title>Sponsor</Detail.Title>
            <Author.Author />
          </Detail>
          <Detail>
            <Detail.Title>Chain/Project</Detail.Title>
            <div className="flex space-x-2">
              <ProjectBadge slug={"Solana"} />
            </div>
          </Detail>
        </div> */}
        <div className="max-w-2xl text-[#666666] text-[14px]">
          Challenge marketplace details, we’ll give the DAO a template / Challenge marketplace details, we’ll give the
          DAO a template / Challenge marketplace details, we’ll give the DAO a template Challenge
        </div>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <Tabs>
            <Tabs.List>
              <Tabs.Tab> {`Challenges (${challenges.length})`} </Tabs.Tab>
              <Tabs.Tab> Prerequisites </Tabs.Tab>
              <Tabs.Tab> Rewards </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
              <Tabs.Panel>
                <WrappedMarketplacesChallengesTable />
              </Tabs.Panel>
              <Tabs.Panel>
                <Prerequisites />
              </Tabs.Panel>
              <Tabs.Panel>
                <Rewards />
              </Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </main>
      </section>
    </div>
  );
}

function SearchAndFilter() {
  return (
    // <Form className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5">
    //   <Input placeholder="Search" name="q" radius="md" rightSection={<Search16 />} />
    //   <Text size="lg" weight={600}>
    //     Sort:
    //   </Text>
    //   <Select
    //     radius="md"
    //     placeholder="Select option"
    //     name="sortBy"
    //     clearable
    //     data={[
    //       { label: "Chain/Project", value: "project" },
    //       { label: "Reward Pool", value: "reward" },
    //     ]}
    //   />
    //   <Text size="lg" weight={600}>
    //     Filter:
    //   </Text>
    //   <MultiSelect
    //     radius="md"
    //     label="I am able to"
    //     placeholder="Select option"
    //     name="filter"
    //     clearable
    //     data={[
    //       { value: "submit", label: "Submit" },
    //       { value: "review", label: "Review" },
    //     ]}
    //   />
    //   <MultiSelect
    //     radius="md"
    //     label="Reward Token"
    //     placeholder="Select option"
    //     name="rewardToken"
    //     clearable
    //     data={[
    //       { label: "Solana", value: "Solana" },
    //       { label: "Ethereum", value: "Ethereum" },
    //       { label: "USD", value: "USD" },
    //     ]}
    //   />
    //   <MultiSelect
    //     radius="md"
    //     label="Chain/Project"
    //     placeholder="Select option"
    //     name="chainProject"
    //     clearable
    //     data={[
    //       { label: "Solana", value: "Solana" },
    //       { label: "Ethereum", value: "Ethereum" },
    //     ]}
    //   />
    //   <Button radius="md" variant="light" size="xs" type="submit">
    //     Apply Filters
    //   </Button>
    // </Form>
    <></>
  );
}

function Prerequisites() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate">
            <div className="space-y-4 md:w-4/5">
              <div className="text-[14px] text-[#666666]">
                What you must hold in your connected wallet to perform various actions on this challenge
              </div>
              <Card>
                <div className="font-weight-500 text-[16px] text-[#252525]">
                  You must hold this much xMETRIC to enter submissions for this challenge
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <div className="text-[12px] text-[#666666] mb-2">MIN BALANCE</div>
                    <Badge>
                      <div className="normal-case">15 xMetric</div>
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[12px] text-[#666666] mb-2">MAX BALANCE</div>
                    <Badge>
                      <div className="normal-case">100 xMetric</div>
                    </Badge>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="font-weight-500 text-[16px] text-[#252525]">
                  You must hold this badge to review and score submissions on this challenge
                </div>
                <div className="text-[12px] text-[#666666]">MDAO S4 REVIEWER BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-[16px] text-[#252525]">0x1234</div>
                </div>
              </Card>
              <Card>
                <div className="font-weight-500 text-[16px] text-[#252525]">
                  You must hold this badge to launch new challenges
                </div>
                <div className="text-[12px] text-[#666666]">MDAO S4 CONTRIBUTOR BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-[16px] text-[#252525]">0x1234</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

function Rewards() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate space-y-4 md:w-4/5">
            <div className="text-[14px] text-[#666666]">
              How rewards are distributed for all challenges in this challenge marketplace and how liquid it currently
              is
            </div>
            <Card>
              <div className="font-weight-500 text-[16px] text-[#252525]">Challenge Pools Total</div>
              <div className="text-[12px] text-[#666666]">SUM OF ALL ACTIVE CHALLENGE REWARD POOLS</div>
              <div>100 SOL</div>
            </Card>
            <Card>
              <div className="font-weight-500 text-[16px] text-[#252525]">Avg. Challenge Pool</div>
              <div className="text-[14px] text-[#666666]">
                AVERAGE REWARD POOL VALUE FOR ACTIVE CHALLENGES IN THIS CHALLENGE MARKETPLACE
              </div>
              <div>100 SOL</div>
            </Card>
            <Card>
              <div className="font-weight-500 text-[16px] text-[#252525]">Reward Curve</div>
              <div className="text-[12px] text-[#666666]">HOW ALL CHALLENGE REWARD POOLS ARE DISTRIBUTED</div>
              <div className="flex flex-row space-x-3 mt-1">
                <Badge>Aggresive</Badge>
                <div className="text-[12px]">
                  Rewards the top 10% of submissions. Winners are determined through peer review
                </div>
              </div>
            </Card>
            <Card>
              <div className="font-weight-500 text-[16px] text-[#252525]">Reward Tokens</div>
              <div className="text-[12px] text-[#666666]">TOKENS YOU CAN EARN IN THIS CHALLENGE MARKETPLACE</div>
              <div className="flex flex-row space-x-3 mt-1">{/* <TokenBadge slug="Solana" /> */}</div>
            </Card>
          </div>
        </div>
      </main>
    </section>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function MarketplacesChallengesTable() {
  const { challenges } = useTypedLoaderData<typeof loader>();

  if (challenges.length === 0) {
    return <div>No results. Try changing search and filter options.</div>;
  }
  return (
    <>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <div className="col-span-2">
          <div className="text-[#666666] text-[12px]">Challenge</div>
        </div>
        <div className="text-[#666666] text-[12px]">Chain/Project</div>
        <div className="text-[#666666] text-[12px]">Reward Pool</div>
        <div className="text-[#666666] text-[12px]">Submit Deadline</div>
        <div className="text-[#666666] text-[12px]">Review Deadline</div>
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {challenges.map((c) => {
          return (
            <Link
              to={`/app/brainstorm/c/${c.id}`}
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={c.id}
            >
              <div className="lg:hidden">Challenge Marketplaces</div>
              <div className="lg:col-span-2 text-[#252525] text-[14px]">{c.title}</div>
              <div className="lg:hidden">Chain/Project</div>
              <div>
                {/* {c.laborMarket.projects.map((p) => (
                  <ProjectBadge key={p.id} slug={p.slug} />
                ))} */}
              </div>
              <div className="lg:hidden">Reward Pool Totals</div>
              {/* <TextWithIcon text="5 SOL" iconUrl="/img/icons/project-icons/sol.svg" /> */}
              <div className="lg:hidden">Submit Deadline</div>
              <span className="text-[#666666] text-[14px]">
                <Countdown date={"2023-01-25"} />
              </span>
              <div className="lg:hidden">Review Deadline</div>
              <span className="text-[#666666] text-[14px]">
                <Countdown date={"2022-11-25"} />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function WrappedMarketplacesChallengesTable() {
  const { totalResults, params } = useTypedLoaderData<typeof loader>();

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <MarketplacesChallengesTable />
          <div className="w-fit m-auto">
            <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
          </div>
        </div>
      </main>
      <aside className="md:w-1/5">
        <SearchAndFilter />
      </aside>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="container border-2 rounded-md p-4 space-y-3">{children}</div>;
}
