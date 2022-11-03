import { Search16 } from "@carbon/icons-react";
import { Detail } from "~/components/Detail";
import * as Author from "~/components/Author";

export default function ChallengeSubmission() {
  return (
    <div className="mx-auto container mb-12 px-10">
      <section className="flex flex-wrap gap-5 justify-between pt-12 pb-5">
        <Title order={2}>Question Title</Title>
        <Center className="flex flex-wrap gap-5">
          <Link to="/app/t/[topicId]/submission/review">
            <Button variant="default" color="dark" radius="md" className="mx-auto">
              Review Question
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
        <div className="flex flex-wrap gap-x-8">
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
            <Badge color="gray" size="lg">
              80
            </Badge>
          </Detail>
          <Detail>
            <Detail.Title>Reviews</Detail.Title>
            <Badge color="gray" size="lg">
              99
            </Badge>
          </Detail>
        </div>
        <Text color="dimmed" className="max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac augue interdum mattis elit quam sapien tellus
          pellentesque. Vel magna consectetur mauris eu. Mauris arcu diam dolor ut tincidunt. Sit euismod sit fermentum,
          consequat maecenas. Ante odio eget nunc velit id volutpat. Aliquam leo non viverra metus, ligula commodo
          aliquet velit massa. Lacinia lacus amet massa
        </Text>
      </section>
      <Divider />

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
                          className="flex border-solid border-2 border-[#EDEDED] py-3 px-4 rounded-lg hover:bg-stone-100 items-center"
                          key={m.id}
                        >
                          <main className="flex items-center flex-1 space-x-2">
                            <Avatar alt="" />
                            <Text weight={500}>user.ETH</Text>
                            <Badge color="gray" radius="sm">
                              <Text weight={400} className="normal-case">
                                400 xMetric
                              </Text>
                            </Badge>
                          </main>
                          <aside className="md:w-1/5">
                            <Text>12 hours ago</Text>
                          </aside>
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
              <Input placeholder="Search" name="search" icon={<Search16 />} />
              <Select
                label="Sort"
                placeholder="Select option"
                name="sortBy"
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
    </div>
  );
}
