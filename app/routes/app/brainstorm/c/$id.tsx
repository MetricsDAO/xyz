import { Search16 } from "@carbon/icons-react";
import { Input, Select, Title, Text, Button, Center, Divider, Paper, Badge, Avatar, Checkbox } from "@mantine/core";
import { Form, Link } from "@remix-run/react";
import { Detail } from "~/components/Detail";
import * as Author from "~/components/Author";
import { ProjectBadge } from "~/components/ProjectBadge";
import { CountDownCard } from "~/components/CountDownCard";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { findChallenge } from "~/services/challenges-service.server";
import { typedjson } from "remix-typedjson";
import type { UseDataFunctionReturn } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { CountDown } from "~/components/CountDown";
import { Tabs } from "~/components/tabs";

const paramsSchema = z.object({ id: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);
  const challenge = await findChallenge(id);
  if (!challenge) {
    throw notFound({ id });
  }

  return typedjson({ challenge }, { status: 200 });
};

export default function Challenge() {
  const { challenge } = useTypedLoaderData<typeof loader>();
  const submissions = challenge.submissions;

  return (
    <div className="mx-auto container mb-12 px-10 pt-12">
      <section className="flex flex-wrap gap-5 justify-between pb-5">
        <Title order={2}>{challenge.title}</Title>
        <Center className="flex flex-wrap gap-5">
          <Link to={`/app/brainstorm/c/${challenge.id}/review`}>
            <Button variant="default" color="dark" radius="md" className="mx-auto">
              Claim to Review
            </Button>
          </Link>
          <Link to={`/app/brainstorm/c/${challenge.id}/claim`}>
            <Button radius="md" className="mx-auto">
              Claim to Submit
            </Button>
          </Link>
        </Center>
      </section>
      <section className="flex flex-col space-y-7 pb-12">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Detail>
            <Detail.Title>Sponsor</Detail.Title>
            <Author.Author />
          </Detail>
          <Detail>
            <Detail.Title>Chain/Project</Detail.Title>
            <div className="flex space-x-2">
              <ProjectBadge slug="solana" />
              <ProjectBadge slug="solana" />
            </div>
          </Detail>
          <Detail>
            <Detail.Title>Reward Pool</Detail.Title>
            <Badge color="gray" size="lg">
              100 SOL
            </Badge>
          </Detail>
          <Detail>
            <Detail.Title>Submissions</Detail.Title>
            <Badge color="gray" size="lg">
              1000
            </Badge>
          </Detail>
          <Detail>
            <Detail.Title>Reviews</Detail.Title>
            <Badge color="gray" size="lg">
              99
            </Badge>
          </Detail>
          <Detail>
            <Detail.Title>Winners</Detail.Title>
            <Badge color="gray" size="lg">
              <Text size="sm" className="normal-case font-normal">
                Pending
              </Text>
            </Badge>
          </Detail>
        </div>
        <Text color="dimmed" className="max-w-2xl">
          What's the challenge What web3 challenge do you want to crowdsource potential analytics questions for? Why?
          What's the challenge What web3 challenge do you want to crowdsource potential analytics questions
        </Text>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 gap-x-5">
        <main className="flex-1">
          <Tabs>
            <Tabs.List>
              <Tabs.Tab> {`Submissions (${submissions.length})`} </Tabs.Tab>
              <Tabs.Tab> Prerequisites </Tabs.Tab>
              <Tabs.Tab> Rewards </Tabs.Tab>
              <Tabs.Tab> Timeline & Deadline </Tabs.Tab>
              <Tabs.Tab> Participants </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panels>
              <Tabs.Panel>
                <Submissions submissions={submissions} />
              </Tabs.Panel>
              <Tabs.Panel>
                <Prerequisites />
              </Tabs.Panel>
              <Tabs.Panel>
                <Rewards />
              </Tabs.Panel>
              <Tabs.Panel>
                <Timeline />
              </Tabs.Panel>
              <Tabs.Panel>
                <Participants />
              </Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        </main>
      </section>
    </div>
  );
}

type SubmissionsProps = {
  submissions: UseDataFunctionReturn<typeof loader>["challenge"]["submissions"];
};

function Submissions({ submissions }: SubmissionsProps) {
  const winnerSelected = false;
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
      <main className="min-w-[300px] w-full border-spacing-4 border-separate space-y-3">
        {submissions.map((s) => {
          return (
            <Link
              to={`/app/brainstorm/s/${s.id}`}
              className="flex flex-col md:flex-row gap-x-10 gap-y-3 border-solid border-2 border-[#EDEDED] py-5 px-6 rounded-lg hover:bg-stone-100 items-center space-between"
              key={s.id}
            >
              <div className="flex flex-col flex-1 gap-2">
                <Text weight={500}>{s.title}</Text>
                <Text>{s.description}</Text>
                <div className="flex space-x-1 items-center text-xs">
                  <span>
                    <CountDown date={s.createdAt}></CountDown>
                  </span>
                  <Text size="xs" color="dimmed">
                    by
                  </Text>
                  <Avatar size={26} radius="xl" alt="" />
                  <Text size="xs">user.ETH</Text>
                  <Badge color="gray" radius="md">
                    <Text weight={400} className="normal-case">
                      400 xMetric
                    </Text>
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex rounded-lg bg-[#EFA453] items-center w-32">
                  <div className="rounded-lg bg-[#FFE2C2] py-2 w-24">
                    <Text align="center">Bad</Text>
                  </div>
                  <Text color="white" className="mx-auto">
                    50
                  </Text>
                </div>
                <Text align="center">55 reviews</Text>
              </div>
            </Link>
          );
        })}
      </main>
      <aside className="md:w-1/4">
        <Form className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-brand-400 bg-opacity-5 rounded-lg p-4">
          <Input radius="md" placeholder="Search" name="search" icon={<Search16 />} />
          <Select
            label="Sort"
            placeholder="Select option"
            name="sortBy"
            radius="md"
            clearable
            data={[{ label: "Chain/Project", value: "project" }]}
          />
          <Checkbox.Group label="Filter:" description="Overall Score" spacing="xs" orientation="vertical">
            {winnerSelected ? (
              <div>
                <Checkbox value="winner" label="Winner" />
                <Divider size="xs" />
              </div>
            ) : null}
            <Checkbox value="great" label="Great" />
            <Checkbox value="good" label="Good" />
            <Checkbox value="average" label="Average" />
            <Checkbox value="bad" label="Bad" />
            <Checkbox value="spam" label="Spam" />
          </Checkbox.Group>
        </Form>
      </aside>
    </section>
  );
}

function Prerequisites() {
  return (
    <section className="w-full border-spacing-4 border-separate space-y-3 md:w-4/5">
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
    </section>
  );
}

function Rewards() {
  return (
    <section className="space-y-3 w-full border-spacing-4 border-separate md:w-4/5">
      <Paper shadow="xs" radius="md" p="md" withBorder>
        <Text weight={600}>Reward Pool</Text>
        <Text weight={500} color="dimmed" size="xs" className="mt-3">
          TOTAL REWARDS TO BE DISTRIBUTED ACROSS WINNERS
        </Text>
        <Text weight={400}>100 SOL</Text>
      </Paper>
      <Paper shadow="xs" radius="md" p="md" withBorder>
        <Text weight={600}>Reward Curve</Text>
        <Text weight={500} color="dimmed" size="xs" className="mt-3">
          HOW THE REWARD POOL IS DISTRIBUTED
        </Text>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          <Badge size="sm" radius="sm">
            Aggresive
          </Badge>
          <Text size="sm">Rewards the top 10% of submissions. Winners are determined through peer review</Text>
        </div>
      </Paper>
    </section>
  );
}

function Timeline() {
  return (
    <section className="w-full border-spacing-4 border-separate space-y-4 md:w-5/6">
      <Text weight={600} size="lg">
        Upcoming
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <CountDownCard progress={10} time={"2023-01-25"} subText="claim to review deadline" />
        <CountDownCard progress={43} time={"2023-01-25"} subText="claim to review deadline" />
        <CountDownCard progress={22} time={"2023-01-25"} subText="claim to review deadline" />
        <CountDownCard progress={61} time={"2023-01-25"} subText="claim to review deadline" />
      </div>
      <Text weight={600} size="lg">
        Past
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <CountDownCard progress={100} time={"2023-01-25"} subText="claim to review deadline" />
      </div>
    </section>
  );
}

function Participants() {
  return (
    <section className="space-y-7">
      <div className="flex items-center space-x-2 text-left px-4">
        <Text size="sm">Average user xMETRIC</Text>
        <Badge color="dark">1,000</Badge>
      </div>
      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
        <main className="w-full border-spacing-4 border-separate space-y-4">
          {/* Mocking for now */}
          {[1, 2].map((m) => {
            return (
              <Link
                to="/u/[uId]"
                className="flex flex-col md:flex-row gap-3 border-solid border-2 border-[#EDEDED] py-3 px-4 rounded-lg hover:bg-stone-100 items-center space-between"
                key={m}
              >
                <div className="flex flex-col md:flex-row items-center flex-1 gap-2">
                  <Avatar alt="" />
                  <Text weight={500}>user.ETH</Text>
                  <Badge color="gray" radius="sm">
                    <Text weight={400} className="normal-case">
                      400 xMetric
                    </Text>
                  </Badge>
                </div>
                <Text>12 hours ago</Text>
              </Link>
            );
          })}
        </main>
        <aside className="md:w-1/5">
          <Form className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-brand-400 bg-opacity-5 rounded-lg p-4">
            <Input radius="md" placeholder="Search" name="search" icon={<Search16 />} />
            <Select
              label="Sort"
              placeholder="Select option"
              name="sortBy"
              radius="md"
              clearable
              data={[{ label: "Chain/Project", value: "project" }]}
            />
            <Checkbox.Group label="Filter:" spacing="xs" orientation="vertical">
              <Checkbox value="claimedSubmit" label="Claimed to Submit" />
              <Checkbox value="submitted" label="Submitted" />
              <Checkbox value="calimedReview" label="Claimed to Review" />
              <Checkbox value="reviewed" label="Reviewed" />
            </Checkbox.Group>
          </Form>
        </aside>
      </div>
    </section>
  );
}
