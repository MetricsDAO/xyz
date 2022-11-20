import { Search16 } from "@carbon/icons-react";
import { Detail, DetailItem } from "~/components/Detail";
import { Author } from "~/components/Author";
import { Badge, Button, Center, Divider, Title, Text, Avatar, Input, Select, Checkbox, Paper } from "@mantine/core";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { useTypedLoaderData } from "remix-typedjson/dist/remix";
import { typedjson } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { findSubmission } from "~/services/submissions.server";
import { Drawer } from "~/components/Drawer";
import { Container } from "~/components/Container";

const paramsSchema = z.object({ id: z.string() });

export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);

  const submission = await findSubmission(id);
  if (!submission) {
    throw notFound({ id });
  }

  return typedjson({ submission }, { status: 200 });
};

export default function ChallengeSubmission() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selected, setSelected] = useState<"great" | "good" | "average" | "bad" | "spam">("average");
  const { submission } = useTypedLoaderData<typeof loader>();

  const isWinner = true;

  const reviews = submission.reviews;

  return (
    <>
      <Drawer
        props={{
          showDrawer,
          setShowDrawer,
        }}
      >
        <div className="flex flex-col mx-auto space-y-10 px-2">
          <div className="space-y-3">
            <Title order={2} weight={600} className="mb-1">
              {"Review Question"}
            </Title>
            <Text italic color="dimmed">
              Important: You can’t edit this score after submitting. Double check your score and ensure it’s good to go
            </Text>
          </div>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => setSelected("great")}
              variant="default"
              disabled={selected === "great"}
              sx={{
                "&[data-disabled]": { backgroundColor: "#D9F0CA", color: "black" },
              }}
            >
              Great
            </Button>
            <Button
              onClick={() => setSelected("good")}
              variant="default"
              disabled={selected === "good"}
              sx={{
                "&[data-disabled]": { backgroundColor: "#D1DEFF", color: "black" },
              }}
            >
              Good
            </Button>
            <Button
              onClick={() => setSelected("average")}
              variant="default"
              disabled={selected === "average"}
              sx={{
                "&[data-disabled]": { backgroundColor: "#EDEDED", color: "black" },
              }}
            >
              Average
            </Button>
            <Button
              onClick={() => setSelected("bad")}
              variant="default"
              disabled={selected === "bad"}
              sx={{
                "&[data-disabled]": { backgroundColor: "#FFE2C2", color: "black" },
              }}
            >
              Bad
            </Button>
            <Button
              onClick={() => setSelected("spam")}
              variant="default"
              disabled={selected === "spam"}
              sx={{
                "&[data-disabled]": { backgroundColor: "#F8D4D7", color: "black" },
              }}
            >
              Spam
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            <Button fullWidth variant="default">
              Cancel
            </Button>
            <Button fullWidth>Submit Score</Button>
          </div>
        </div>
      </Drawer>
      <Container className="py-16">
        <div className="mx-auto container mb-12 px-10">
          <section className="flex flex-wrap gap-5 justify-between pb-10">
            <div className="flex items-center gap-2">
              <Title order={2}>{submission.title}</Title>
              {isWinner ? <Avatar size="sm" src="/img/trophy.svg" /> : <></>}
            </div>
            <Center className="flex flex-wrap gap-5">
              <Button radius="md" className="mx-auto" onClick={() => setShowDrawer(true)}>
                Review Question
              </Button>
            </Center>
          </section>
          <section className="flex flex-col space-y-7 pb-24">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <Detail>
                <DetailItem title="Author">
                  <Author />
                </DetailItem>
                <DetailItem title="Created">
                  <Badge>1 month 5 days ago</Badge>
                </DetailItem>
                <DetailItem title="Overall Score">
                  <Badge className="bg-blue-500">
                    <Badge className="bg-blue-300">Good</Badge>
                    <span>80</span>
                  </Badge>
                </DetailItem>
                <DetailItem title="Reviews">
                  <Badge>99</Badge>
                </DetailItem>
                {isWinner ? (
                  <DetailItem title="Winner">
                    <Badge className="bg-yellow-600">
                      <Badge className="bg-yellow-300 text-yellow-700">🏆 100 SOL</Badge>
                      <span className="text-white">100 SOL</span>
                    </Badge>
                  </DetailItem>
                ) : null}
              </Detail>
            </div>
            <Text color="dimmed" className="max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
              pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit
              fermentum, consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus,
              ligula commodo aliquet velit massa. Lacinia lacus amet massa
            </Text>
          </section>
          <section>
            <Title order={3}>Reviews ({reviews.length})</Title>
            <Divider />
          </section>

          <section className="mt-3">
            <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
              <main className="flex-1">
                <div className="w-full border-spacing-4 border-separate space-y-5">
                  {reviews.map((m) => {
                    return (
                      <Link
                        to="/u/[uId]"
                        className="flex flex-col md:flex-row gap-3 border-solid border-2 border-[#EDEDED] py-3 px-4 rounded-lg hover:bg-stone-100 items-center space-between"
                        key={m.id}
                      >
                        <div className="flex flex-col md:flex-row items-center flex-1 gap-2">
                          <Paper p="xs" sx={{ backgroundColor: "#D9F0CA", width: 100 }}>
                            <Text align="center">Great</Text>
                          </Paper>
                          <Avatar alt="" className="md:ml-2" radius="xl" />
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
              </main>
              <aside className="md:w-1/5">
                <Form className="space-y-3 border-[1px] border-solid border-[#EDEDED] bg-brand-400 bg-opacity-5 rounded-lg p-4">
                  <Input placeholder="Search" name="search" icon={<Search16 />} radius="md" />
                  <Select
                    radius="md"
                    label="Sort"
                    name="sortBy"
                    clearable
                    data={[{ label: "Chain/Project", value: "project" }]}
                  />
                  <Checkbox.Group label="Filter:" description="Overall score" spacing="xs" orientation="vertical">
                    <Checkbox value="great" label="Great" />
                    <Checkbox value="good" label="Good" />
                    <Checkbox value="average" label="Average" />
                    <Checkbox value="bad" label="Bad" />
                    <Checkbox value="spam" label="Spam" />
                  </Checkbox.Group>
                </Form>
              </aside>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
