import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Form, Link } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import type { DataFunctionArgs } from "remix-typedjson/dist/remix";
import { typedjson, useTypedLoaderData } from "remix-typedjson/dist/remix";
import { notFound } from "remix-utils";
import { z } from "zod";
import { Author } from "~/components/Author";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/button";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/checkbox/checkbox";
import { Container } from "~/components/Container";
import { Detail, DetailItem } from "~/components/detail";
import { Drawer } from "~/components/drawer/drawer";
import { Input } from "~/components/input/input";
import { Select } from "~/components/Select";
import { findSubmission } from "~/services/submissions.server";

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
  const { submission } = useTypedLoaderData<typeof loader>();

  const isWinner = true;

  const reviews = submission.reviews;

  return (
    <>
      <Container className="py-16">
        <div className="mx-auto container mb-12 px-10">
          <section className="flex flex-wrap gap-5 justify-between pb-10">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold">{submission.title}</h1>
              {isWinner && <img className="w-12 h-12" src="/img/trophy.svg" alt="trophy" />}
            </div>
            <ReviewQuestionDrawerButton />
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
                  <Badge className="bg-blue-400 pl-0">
                    <Badge className="bg-blue-200 mr-2">Good</Badge>
                    <span>80</span>
                  </Badge>
                </DetailItem>
                <DetailItem title="Reviews">
                  <Badge>99</Badge>
                </DetailItem>
                {isWinner && (
                  <DetailItem title="Winner">
                    <Badge className="bg-yellow-600 pl-0">
                      <Badge className="bg-yellow-200 text-yellow-700 mr-2">🏆 100 SOL</Badge>
                      <span className="text-white">50 rMetric</span>
                    </Badge>
                  </DetailItem>
                )}
              </Detail>
            </div>
            <p className="text-gray-500 max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
              pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit
              fermentum, consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus,
              ligula commodo aliquet velit massa. Lacinia lacus amet massa
            </p>
          </section>
          <h2 className="text-lg font-semibold border-b border-gray-100 py-4 mb-6">Reviews ({reviews.length})</h2>

          <section className="mt-3">
            <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
              <main className="flex-1">
                <div className="w-full border-spacing-4 border-separate space-y-5">
                  {reviews.map((m) => {
                    return (
                      <Card asChild key={m.id}>
                        <Link
                          to="/u/[uId]"
                          className="flex flex-col md:flex-row gap-3 py-3 px-4 items-center space-between"
                        >
                          <div className="flex flex-col md:flex-row items-center flex-1 gap-2">
                            <div className="flex bg-lime-200 w-24 h-12 justify-center items-center rounded-lg">
                              <p>Great</p>
                            </div>
                            <Avatar />
                            <p className="font-medium">user.ETH</p>
                            <Badge>
                              <p>400 xMetric</p>
                            </Badge>
                          </div>
                          <p>12 hours ago</p>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </main>
              <aside className="md:w-1/5">
                <Form className="space-y-3 border bg-opacity-5 rounded-lg p-4">
                  <Input placeholder="Search" name="search" iconLeft={<MagnifyingGlassIcon className="w-5 h-5" />} />
                  <Select label="Sort" name="sortBy" options={[{ label: "Chain/Project", value: "project" }]} />
                  <Checkbox value="great" label="Great" />
                  <Checkbox value="good" label="Good" />
                  <Checkbox value="average" label="Average" />
                  <Checkbox value="bad" label="Bad" />
                  <Checkbox value="spam" label="Spam" />
                </Form>
              </aside>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

function ReviewQuestionDrawerButton() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<"great" | "good" | "average" | "bad" | "spam">("average");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Review Question</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col mx-auto space-y-10 px-2">
          <div className="space-y-3">
            <p className="text-3xl font-semibold">{"Review Question"}</p>
            <p className="italic text-gray-500">
              Important: You can't edit this score after submitting. Double check your score and ensure it's good to go
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              onClick={() => setSelected("great")}
              className={clsx("hover:bg-green-200", {
                "bg-green-200": selected === "great",
              })}
            >
              Great
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected("good")}
              className={clsx("hover:bg-blue-200", {
                "bg-blue-200": selected === "good",
              })}
            >
              Good
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected("average")}
              className={clsx("hover:bg-gray-200", {
                "bg-gray-200": selected === "average",
              })}
            >
              Average
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected("bad")}
              className={clsx("hover:bg-orange-200", {
                "bg-orange-200": selected === "bad",
              })}
            >
              Bad
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelected("spam")}
              className={clsx("hover:bg-red-200", {
                "bg-red-200": selected === "spam",
              })}
            >
              Spam
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="cancel" className="w-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="w-full">Submit Score</Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
