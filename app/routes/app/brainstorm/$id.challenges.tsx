import { Search16 } from "@carbon/icons-react";
import {
  Input,
  Select,
  Title,
  Text,
  Button,
  Center,
  Tabs,
  Paper,
  Badge,
  Avatar,
  MultiSelect,
  Pagination,
} from "@mantine/core";
import { Form, Link, useSearchParams } from "@remix-run/react";
import { Detail } from "~/components/Detail";
import * as Author from "~/components/Author";
import type { DataFunctionArgs, UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { typedjson } from "remix-typedjson/dist/remix";
import { getParamsOrFail } from "remix-params-helper";
import { ChallengeSearchSchema } from "~/domain/challenge";
import { ProjectBadge, TextWithIcon, TokenBadge } from "~/components/ProjectBadge";
import { CountDown } from "~/components/CountDown";
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
  const { challenges, totalResults, params, laborMarket } = useTypedLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const onPaginationChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto container mb-12 px-10">
      <section className="flex flex-wrap gap-5 justify-between pb-5">
        <Title order={2}>{laborMarket?.title} </Title>
        <Center className="flex flex-wrap gap-5">
          <Link to="/app/brainstorm/[marketplaceId]/claim">
            <Button radius="md" className="mx-auto">
              Launch Challenge
            </Button>
          </Link>
        </Center>
      </section>
      <section className="flex flex-col space-y-7 pb-12">
        <div className="flex flex-wrap gap-x-8">
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
        </div>
        <Text color="dimmed" className="max-w-2xl">
          Challenge marketplace details, we’ll give the DAO a template / Challenge marketplace details, we’ll give the
          DAO a template / Challenge marketplace details, we’ll give the DAO a template Challenge
        </Text>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <Tabs defaultValue="challenges">
            <Tabs.List className="mb-5">
              <Tabs.Tab value="challenges">Challenges</Tabs.Tab>
              <Tabs.Tab value="prerequisites">Prerequisites</Tabs.Tab>
              <Tabs.Tab value="rewards">Rewards</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="challenges" pt="xs">
              <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
                <main className="flex-1">
                  <div className="space-y-5">
                    <MarketplacesChallengesTable challenges={challenges} />
                    <div className="w-fit m-auto">
                      <Pagination
                        page={params.page}
                        hidden={challenges.length === 0}
                        onChange={onPaginationChange}
                        total={Math.ceil(totalResults / params.first)}
                      />
                    </div>
                  </div>
                </main>
                <aside className="md:w-1/5">
                  <SearchAndFilter />
                </aside>
              </section>
            </Tabs.Panel>

            <Tabs.Panel value="prerequisites" pt="xs">
              <Prerequisites />
            </Tabs.Panel>

            <Tabs.Panel value="rewards" pt="xs">
              <Rewards />
            </Tabs.Panel>
          </Tabs>
        </main>
      </section>
    </div>
  );
}

function SearchAndFilter() {
  return (
    <Form className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5">
      <Input placeholder="Search" name="q" radius="md" rightSection={<Search16 />} />
      <Text size="lg" weight={600}>
        Sort:
      </Text>
      <Select
        radius="md"
        placeholder="Select option"
        name="sortBy"
        clearable
        data={[
          { label: "Chain/Project", value: "project" },
          { label: "Reward Pool", value: "reward" },
        ]}
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

function Prerequisites() {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate">
            <div className="space-y-4 md:w-4/5">
              <Text color="dimmed">
                What you must hold in your connected wallet to perform various actions on this challenge
              </Text>
              <Paper shadow="xs" radius="md" p="md" withBorder className="space-y-3">
                <Text weight={600}>You must hold this much xMETRIC to enter submissions for this challenge</Text>
                <div className="flex flex-wrap gap-3">
                  <Center className="flex flex-col">
                    <Text size="xs" color="gray" className="mb-2">
                      MIN BALANCE
                    </Text>
                    <Badge color="gray" radius="sm">
                      <Text weight={600} className="normal-case">
                        15 xMetric
                      </Text>
                    </Badge>
                  </Center>
                  <Center className="flex flex-col">
                    <Text size="xs" color="gray" className="mb-2">
                      MAX BALANCE
                    </Text>
                    <Badge color="gray" radius="sm">
                      <Text weight={600} className="normal-case">
                        100 xMetric
                      </Text>
                    </Badge>
                  </Center>
                </div>
              </Paper>
              <Paper shadow="xs" radius="md" p="md" withBorder className="space-y-3">
                <Text weight={600}>You must hold this badge to review and score submissions on this challenge</Text>
                <Text color="dimmed" size="xs">
                  MDAO S4 REVIEWER BADGE
                </Text>
                <div className="flex gap-2">
                  <Avatar size={26} radius="xl" alt="" />
                  <Text>0x1234</Text>
                </div>
              </Paper>
              <Paper shadow="xs" radius="md" p="md" withBorder className="space-y-3">
                <Text weight={600}>You must hold this badge to launch new challenges</Text>
                <Text color="dimmed" size="xs">
                  MDAO S4 CONTRIBUTOR BADGE
                </Text>
                <div className="flex gap-2">
                  <Avatar size={26} radius="xl" alt="" />
                  <Text>0x1234</Text>
                </div>
              </Paper>
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
            <Text color="dimmed">
              How rewards are distributed for all challenges in this challenge marketplace and how liquid it currently
              is
            </Text>
            <Paper shadow="xs" radius="md" p="md" withBorder>
              <Text weight={600}>Challenge Pools Total</Text>
              <Text weight={500} color="dimmed" size="xs" className="mt-3">
                SUM OF ALL ACTIVE CHALLENGE REWARD POOLS
              </Text>
              <Text weight={400}>100 SOL</Text>
            </Paper>
            <Paper shadow="xs" radius="md" p="md" withBorder>
              <Text weight={600}>Avg. Challenge Pool</Text>
              <Text weight={500} color="dimmed" size="xs" className="mt-3">
                AVERAGE REWARD POOL VALUE FOR ACTIVE CHALLENGES IN THIS CHALLENGE MARKETPLACE
              </Text>
              <Text weight={400}>100 SOL</Text>
            </Paper>
            <Paper shadow="xs" radius="md" p="md" withBorder>
              <Text weight={600}>Reward Curve</Text>
              <Text weight={500} color="dimmed" size="xs" className="mt-3">
                HOW ALL CHALLENGE REWARD POOLS ARE DISTRIBUTED
              </Text>
              <div className="flex flex-row space-x-3 mt-1">
                <Badge size="sm" radius="sm">
                  Aggresive
                </Badge>
                <Text size="sm">Rewards the top 10% of submissions. Winners are determined through peer review</Text>
              </div>
            </Paper>
            <Paper shadow="xs" radius="md" p="md" withBorder>
              <Text weight={600}>Reward Tokens</Text>
              <Text weight={500} color="dimmed" size="xs" className="mt-3">
                TOKENS YOU CAN EARN IN THIS CHALLENGE MARKETPLACE
              </Text>
              <div className="flex flex-row space-x-3 mt-1">
                <TokenBadge slug="Solana" />
              </div>
            </Paper>
          </div>
        </div>
      </main>
    </section>
  );
}

type MarketplaceChallengesTableProps = {
  challenges: UseDataFunctionReturn<typeof loader>["challenges"];
};

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function MarketplacesChallengesTable({ challenges }: MarketplaceChallengesTableProps) {
  if (challenges.length === 0) {
    return <Text>No results. Try changing search and filter options.</Text>;
  }
  return (
    <>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <div className="col-span-2">
          <Text color="dark.3">Challenge</Text>
        </div>
        <Text color="dark.3">Chain/Project</Text>
        <Text color="dark.3">Reward Pool</Text>
        <Text color="dark.3">Submit Deadline</Text>
        <Text color="dark.3">Review Deadline</Text>
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
              <div className="lg:col-span-2">
                <Text>{c.title}</Text>
              </div>
              <div className="lg:hidden">Chain/Project</div>
              <div>
                {c.laborMarket.projects.map((p) => (
                  <ProjectBadge key={p.id} slug={p.slug} />
                ))}
              </div>
              <div className="lg:hidden">Reward Pool Totals</div>
              <TextWithIcon text="5 SOL" iconUrl="/img/icons/project-icons/sol.svg" />
              <div className="lg:hidden">Submit Deadline</div>
              <span>
                <CountDown date={"2023-01-25"} />
              </span>
              <div className="lg:hidden">Review Deadline</div>
              <span>
                <CountDown date={"2022-11-25"} />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
