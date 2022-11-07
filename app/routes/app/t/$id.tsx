import { Search16 } from "@carbon/icons-react";
import {
  Input,
  Select,
  Title,
  Text,
  Button,
  Center,
  Divider,
  Tabs,
  Paper,
  Badge,
  Avatar,
  Checkbox,
  Progress,
} from "@mantine/core";
import { Form, Link } from "@remix-run/react";
import type { Submission, TopicWithMarketplace } from "~/domain";
import { Detail } from "~/components/Detail";
import * as Author from "~/components/Author";
import { ProjectBadge } from "~/components/ProjectBadge";

export default function Challenge() {
  return (
    <div className="mx-auto container mb-12 px-10">
      <section className="flex flex-wrap gap-5 justify-between pt-12 pb-5">
        <Title order={2}>Challenge Title</Title>
        <Center className="flex flex-wrap gap-5">
          <Link to="/app/t/[topicId]/review">
            <Button variant="default" color="dark" radius="md" className="mx-auto">
              Claim to Review
            </Button>
          </Link>
          <Link to="/app/t/[topicId]/claim">
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
          What’s the challenge What web3 topic do you want to crowdsource potential analytics questions for? Why? What’s
          the challenge What web3 topic do you want to crowdsource potential analytics questions
        </Text>
      </section>

      <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <Tabs defaultValue="submissions">
            <Tabs.List className="mb-5">
              <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
              <Tabs.Tab value="prerequisites">Prerequisites</Tabs.Tab>
              <Tabs.Tab value="rewards">Rewards</Tabs.Tab>
              <Tabs.Tab value="timeline">Timeline & Deadlines</Tabs.Tab>
              <Tabs.Tab value="participants">Participants</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="submissions" pt="xs">
              <Submissions submissions={dummySubmissions} />
            </Tabs.Panel>

            <Tabs.Panel value="prerequisites" pt="xs">
              <Prerequisites />
            </Tabs.Panel>

            <Tabs.Panel value="rewards" pt="xs">
              <Rewards />
            </Tabs.Panel>

            <Tabs.Panel value="timeline" pt="xs">
              <Timeline />
            </Tabs.Panel>

            <Tabs.Panel value="participants" pt="xs">
              <Participants submissions={dummySubmissions} />
            </Tabs.Panel>
          </Tabs>
        </main>
      </section>
    </div>
  );
}

function Submissions({ submissions }: { submissions: Submission[] }) {
  const winnerSelected = false;
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="overflow-auto">
            <div className="min-w-[350px] w-full border-spacing-4 border-separate">
              <div className="space-y-4">
                {submissions.map((m) => {
                  return (
                    <Link
                      to="/app/s/[submissionId]"
                      className="flex flex-col md:flex-row gap-x-10 gap-y-3 border-solid border-2 border-[#EDEDED] py-5 px-6 rounded-lg hover:bg-stone-100 items-center space-between"
                      key={m.id}
                    >
                      <div className="flex flex-col flex-1 gap-2">
                        <Text weight={500}>Some bold words</Text>
                        <Text>
                          What are wallets/users swapping their $NEAR for? Analyse the distribution of $NEAR outflow
                          swaps by daily and also show the distribution of $NEAR outflow swaps over time.
                        </Text>
                        <div className="flex space-x-1 items-center">
                          <Text size="xs">12 hours ago</Text>
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
                        <div className="flex rounded-lg bg-sky-500 items-center w-32">
                          <div className="rounded-lg bg-sky-200 py-2 w-24">
                            <Text align="center">Average</Text>
                          </div>
                          <Text color="white" className="mx-auto">
                            80
                          </Text>
                        </div>
                        <Text align="center">55 reviews</Text>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <aside className="md:w-1/5">
        <Form className="space-y-3 bg-sky-50 rounded-lg p-4">
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
            ) : (
              <></>
            )}
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

function Prerequisites({ topic }: { topic: TopicWithMarketplace }) {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
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

function Rewards({ topic }: { topic: TopicWithMarketplace }) {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="min-w-[350px] w-full border-spacing-4 border-separate space-y-4 md:w-4/5">
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
              <div className="flex flex-row space-x-3 mt-1">
                <Badge size="sm" radius="sm">
                  Aggresive
                </Badge>
                <Text size="sm">Rewards the top 10% of submissions. Winners are determined through peer review</Text>
              </div>
            </Paper>
          </div>
        </div>
      </main>
    </section>
  );
}

function Timeline({ topic }: { topic: TopicWithMarketplace }) {
  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
      <main className="flex-1">
        <div className="space-y-5">
          <div className="overflow-auto">
            <div className="min-w-[350px] w-full border-spacing-4 border-separate space-y-4 md:w-5/6">
              <Text weight={600} size="lg">
                Upcoming
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                <CountDown />
                <CountDown />
                <CountDown />
                <CountDown />
              </div>
              <Text weight={600} size="lg">
                Past
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                <CountDown />
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

function Participants({ submissions }: { submissions: Submission[] }) {
  return (
    <section className="space-y-7">
      <div className="flex items-center space-x-2 text-left px-4">
        <Text size="sm">Average user xMETRIC</Text>
        <Badge color="dark">1,000</Badge>
      </div>
      <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <div className="overflow-auto">
              <div className="min-w-[350px] w-full border-spacing-4 border-separate">
                <div className="space-y-4">
                  {submissions.map((m) => {
                    return (
                      <Link
                        to="/u/[uId]"
                        className="flex border-solid border-2 border-[#EDEDED] py-3 px-4 rounded-lg hover:bg-stone-100 items-center space-between"
                        key={m.id}
                      >
                        <div className="flex items-center flex-1 space-x-2">
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
                </div>
              </div>
            </div>
          </div>
        </main>
        <aside className="md:w-1/5">
          <Form className="space-y-3 bg-sky-50 rounded-lg p-4">
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

function CountDown() {
  return (
    <Paper withBorder>
      <Progress value={70} radius="xs" />
      <div className="flex flex-col items-center my-6">
        <Title>2d 6h 10m</Title>
        <Text>claim to review deadline</Text>
      </div>
    </Paper>
  );
}

const dummySubmissions = [
  { id: "1", author: "1234" },
  { id: "2", author: "2234" },
  { id: "3", author: "3234" },
];
