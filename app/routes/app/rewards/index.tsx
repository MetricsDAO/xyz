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
import { ProjectBadge, TextWithIcon } from "~/components/ProjectBadge";
import { countChallenges, searchChallenges } from "~/services/challenges-service.server";

export default function Rewards() {
  const challenges = [{ id: 123, title: "silly string" }];

  return (
    <div className="mx-auto container mb-12 px-10">
      <section className="flex flex-col md:flex-row space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <div className="space-y-5 max-w-3xl">
            <Title order={2} weight={600}>
              Rewards
            </Title>
            <div className="space-y-2">
              <Title order={4} color="brand.4" weight={400}>
                Claim reward tokens for all the challenges you’ve won
              </Title>
              <Text color="dimmed">
                Jump into challenge marketplaces to launch or discover brainstorm challenges. Join challenges to submit
                your best question ideas or review peers' submissions to surface and reward winners
              </Text>
            </div>
          </div>
        </main>
        <aside className="md:w-1/5">
          <Center>
            <Link to="/app/rewards/todo">
              <Button radius="md" className="mx-auto">
                Manage Addresses
              </Button>
            </Link>
          </Center>
        </aside>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <Tabs defaultValue="challenges">
            <Tabs.List className="mb-5">
              <Tabs.Tab value="rewards">My Rewards</Tabs.Tab>
              <Tabs.Tab value="addresses">Payout Addresses</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="challenges" pt="xs">
              <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
                <main className="flex-1">
                  <div className="space-y-5">
                    <MarketplacesChallengesTable challenges={challenges} />
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
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function MarketplacesChallengesTable({ challenges }) {
  if (challenges.length === 0) {
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
        <Text color="dark.3">Reward Pool</Text>
        <Text color="dark.3">Submit Deadline</Text>
        <Text color="dark.3">Review Deadline</Text>
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {challenges.map((c) => {
          return (
            <Link
              to="/app/brainstorm/c/[id]"
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={c.id}
            >
              <div className="lg:hidden">Challenge Marketplaces</div>
              <div className="lg:col-span-2">
                <Text>{c.title}</Text>
              </div>
              <div className="lg:hidden">Chain/Project</div>
              <div className="lg:hidden">Reward Pool Totals</div>
              <TextWithIcon text={`${10000} USD`} iconUrl="/img/icons/dollar.svg" />
              <div className="lg:hidden">Submit Deadline</div>
              <Text color="dark.3">{`TODO`} </Text>
              <div className="lg:hidden">Review Deadline</div>
              <Text color="dark.3">TODO</Text>
            </Link>
          );
        })}
      </div>
    </>
  );
}
