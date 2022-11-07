import { Search16 } from "@carbon/icons-react";
import { Detail } from "~/components/Detail";
import * as Author from "~/components/Author";
import { Badge, Button, Center, Divider, Title, Text, Avatar, Input, Select, Checkbox, Paper } from "@mantine/core";
import { Form, Link } from "@remix-run/react";

export default function ChallengeSubmission() {
  const isWinner = true;

  const reviews = [
    { id: "1", author: "1234" },
    { id: "2", author: "2234" },
    { id: "3", author: "3234" },
  ];

  return (
    <div className="mx-auto container mb-12 px-10">
      <section className="flex flex-wrap gap-5 justify-between pt-12 pb-10">
        <div className="flex items-center gap-2">
          <Title order={2}>Question Title </Title>
          {isWinner ? <Avatar size="sm" src="/img/trophy.svg" /> : <></>}
        </div>
        <Center className="flex flex-wrap gap-5">
          <Link to="/app/t/[topicId]/submission/review">
            <Button radius="md" className="mx-auto">
              Review Question
            </Button>
          </Link>
        </Center>
      </section>
      <section className="flex flex-col space-y-7 pb-24">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Detail>
            <Detail.Title>Sponsor</Detail.Title>
            <Author.Author />
          </Detail>
          <Detail>
            <Detail.Title>Created At</Detail.Title>
            <Badge color="gray" size="lg">
              <Text size="sm" className="normal-case font-normal">
                1 month 5 days ago
              </Text>
            </Badge>
          </Detail>
          <Detail>
            <Detail.Title>Overall Score</Detail.Title>
            <div className="flex rounded-full bg-[#6993FF] items-center w-28">
              <div className="rounded-full bg-[#D1DEFF] w-3/4">
                <Text align="center" className="normal-case font-normal">
                  Good
                </Text>
              </div>
              <Text color="white" className="mx-auto pl-1 pr-2">
                80
              </Text>
            </div>
          </Detail>
          <Detail>
            <Detail.Title>Reviews</Detail.Title>
            <Badge color="gray" size="lg">
              99
            </Badge>
          </Detail>
          {isWinner ? (
            <Detail>
              <Detail.Title>Winner</Detail.Title>
              <Badge color="yellow" size="lg" leftSection={<Avatar size={20} src="/img/trophy.svg" />}>
                <Text color="dark" size="sm" className="normal-case font-normal">
                  100 SOL
                </Text>
              </Badge>
            </Detail>
          ) : (
            <></>
          )}
        </div>
        <Text color="dimmed" className="max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
          pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit fermentum,
          consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus, ligula commodo
          aliquet velit massa. Lacinia lacus amet massa
        </Text>
      </section>
      <section>
        <Title order={3}>Reviews ({reviews.length})</Title>
        <Divider />
      </section>

      <section className="mt-3">
        <div className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
          <main className="flex-1">
            <div className="space-y-5">
              <div className="overflow-auto">
                <div className="w-full border-spacing-4 border-separate">
                  <div className="space-y-4">
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
                </div>
              </div>
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
  );
}
