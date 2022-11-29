import { ChevronSort16, ChevronSortDown16, ChevronSortUp16 } from "@carbon/icons-react";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { Link, useSearchParams, useSubmit } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useCallback, useRef } from "react";
import { getParamsOrFail } from "remix-params-helper";
import type { DataFunctionArgs, UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/button";
import { Card } from "~/components/Card";
import { Combobox } from "~/components/Combobox";
import { Container } from "~/components/Container";
import { Countdown } from "~/components/countdown";
import { Input } from "~/components/Input";
import { Pagination } from "~/components/Pagination";
import { ProjectIcon } from "~/components/project-icon";
import { Select } from "~/components/Select";
import { Header, Row, Table } from "~/components/table";
import { Tabs } from "~/components/Tabs";
import { ChallengeSearchSchema } from "~/domain/challenge";
import { countChallenges, searchChallenges } from "~/services/challenges-service.server";
import { findLaborMarket } from "~/services/labor-market.server";

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
    <Container className="py-16">
      <div className="mx-auto container mb-12 px-10">
        <section className="flex flex-wrap gap-5 justify-between pb-5">
          <h1 className="text-3xl font-semibold">{laborMarket?.title} </h1>
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
          <p className="max-w-2xl text-gray-500 text-sm">
            Challenge marketplace details, we’ll give the DAO a template / Challenge marketplace details, we’ll give the
            DAO a template / Challenge marketplace details, we’ll give the DAO a template Challenge
          </p>
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
    </Container>
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

function Prerequisites() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate">
            <div className="space-y-4 md:w-4/5">
              <p className="text-sm text-gray-500">
                What you must hold in your connected wallet to perform various actions on this challenge
              </p>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this much xMETRIC to enter submissions for this challenge
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MIN BALANCE</div>
                    <Badge>
                      <div className="normal-case">15 xMetric</div>
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 mb-2">MAX BALANCE</div>
                    <Badge>
                      <div className="normal-case">100 xMetric</div>
                    </Badge>
                  </div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this badge to review and score submissions on this challenge
                </p>
                <div className="text-xs text-gray-500">MDAO S4 REVIEWER BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-base text-[#252525]">0x1234</div>
                </div>
              </Card>
              <Card className="p-4 space-y-2">
                <p className="font-weight-500 text-base text-[#252525]">
                  You must hold this badge to launch new challenges
                </p>
                <div className="text-xs text-gray-500">MDAO S4 CONTRIBUTOR BADGE</div>
                <div className="flex gap-2">
                  <Avatar />
                  <div className="text-base text-[#252525]">0x1234</div>
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
            <p className="text-sm text-gray-500">
              How rewards are distributed for all challenges in this challenge marketplace and how liquid it currently
              is
            </p>
            <Card className="p-4 space-around space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Challenge Pools Total</p>
              <p className="text-xs text-gray-500">SUM OF ALL ACTIVE CHALLENGE REWARD POOLS</p>
              <p>100 SOL</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Avg. Challenge Pool</p>
              <p className="text-xs text-gray-500">
                AVERAGE REWARD POOL VALUE FOR ACTIVE CHALLENGES IN THIS CHALLENGE MARKETPLACE
              </p>
              <p>100 SOL</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Curve</p>
              <p className="text-xs text-gray-500">HOW ALL CHALLENGE REWARD POOLS ARE DISTRIBUTED</p>
              <div className="flex flex-row space-x-3 mt-1">
                <Badge>Aggresive</Badge>
                <p className="text-xs">
                  Rewards the top 10% of submissions. Winners are determined through peer review
                </p>
              </div>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="font-weight-500 text-base text-[#252525]">Reward Tokens</p>
              <p className="text-xs text-gray-500">TOKENS YOU CAN EARN IN THIS CHALLENGE MARKETPLACE</p>
              <p className="flex flex-row space-x-3 mt-1">{/* <TokenBadge slug="Solana" /> */}</p>
            </Card>
          </div>
        </div>
      </main>
    </section>
  );
}

type MarketplaceChallengesTableProps = {
  challenges: UseDataFunctionReturn<typeof loader>["challenges"];
};

function MarketplacesChallengesTable({ challenges }: MarketplaceChallengesTableProps) {
  if (challenges.length === 0) {
    return <p>No results. Try changing search and filter options.</p>;
  }
  return (
    <Table>
      <Header columns={6}>
        <Header.Column span={2}>
          <SortButton label="title" title="Challenge" />
        </Header.Column>
        <Header.Column>Chain/Project</Header.Column>
        <Header.Column>Reward Pool</Header.Column>
        <Header.Column>Submit Deadline</Header.Column>
        <Header.Column>Review Deadline</Header.Column>
      </Header>
      {challenges.map((c) => {
        return (
          <Row columns={6} to={`/app/brainstorm/c/${c.id}`} key={c.id}>
            <Row.Column label="Challenges" span={2}>
              {c.title}
            </Row.Column>

            <Row.Column label="Chain/Project">
              <div className="flex">
                <div>
                  {c.laborMarket.projects?.map((p) => (
                    <Badge key={p.slug} className="pl-2">
                      <ProjectIcon project={p} />
                      <span className="mx-1">{p.name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </Row.Column>

            <Row.Column label="Reward Pool">5 Sol</Row.Column>
            <Row.Column label="Submit Deadline">
              <Countdown date={"2023-01-25"} />
            </Row.Column>
            <Row.Column label="Review Deadline">
              <Countdown date={"2022-11-25"} />
            </Row.Column>
          </Row>
        );
      })}
    </Table>
  );
}

function WrappedMarketplacesChallengesTable() {
  const { totalResults, params, challenges } = useTypedLoaderData<typeof loader>();

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <MarketplacesChallengesTable challenges={challenges} />
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
