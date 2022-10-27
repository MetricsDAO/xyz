import { Button, List, Textarea, TextInput, Text, Title, Paper } from "@mantine/core";

export default function SubmitQuestion() {
  return (
    <div className="container mx-auto px-10 max-w-5xl space-y-3">
      <Title order={2} weight={600}>
        {"Submit Question for {Topic}"}
      </Title>
      <Text>{"Submit at least one question idea before the submission deadline in {countdown}."}</Text>
      <div className="flex flex-col md:flex-row md:space-x-20">
        <div className="md:basis-2/3 space-y-10 md:space-y-16">
          <TextInput label="Title" size="md" placeholder="Name" className="mt-1 w-full" />
          <div className="space-y-3">
            <Textarea
              label="Question"
              placeholder="Text"
              className="text-black w-full md:col-span-2"
              size="md"
              autosize
              spellCheck="true"
              minRows={5}
              maxRows={10}
            />
            <Text italic>
              Important: Questions can’t be edited once submitted. Double check your work for typos and ensure your
              question is good to go.
            </Text>
          </div>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <Button variant="default" color="dark" size="md">
              Cancel
            </Button>
            <Button color="dark" size="md">
              Submit Question
            </Button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:basis-1/3">
          <Text size="lg">How to Write a Good Question</Text>
          <Paper p="md" radius="md" withBorder className="text-[#909296]">
            <Text>Don’t assume we will “know what you mean.” </Text>
            <List withPadding className="text-[#909296]">
              <List.Item>Be specific</List.Item>
              <List.Item>Define metrics </List.Item>
              <List.Item>Specify time boundaries</List.Item>
            </List>
          </Paper>
          <Paper p="md" radius="md" withBorder className="text-[#909296] mt-10 space-y-6">
            <Text>ORIGINAL: How many people actively use Sushi? </Text>
            <Text weight={700}>Be specific:</Text>
            <Text>
              The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are we
              talking Ethereum? What about Polygon?
            </Text>
            <Text italic>UPDATE: How many addresses actively use the SUSHI token on Ethereum? </Text>
            <Text weight={700}>Define metrics:</Text>
            <Text>
              What is “active“? What is “use”? These terms can (and will) mean different things to different people. It
              doesn’t matter what definition you use as long as you communicate your expectations. Alternately you can
              ask for the metric to be defined as part of the question.
            </Text>
            <Text italic>UPDATE: How many addresses have transferred SUSHI on Ethereum?</Text>
            <Text weight={700}>Specify time boundaries:</Text>
            <Text>
              We still haven’t fully defined “active”. Specifying time makes the result easier to understand, don’t rely
              on the person answering the question to specify time for you if you didn’t ask them to.
            </Text>
            <Text italic> UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?</Text>
          </Paper>
        </div>
      </div>
    </div>
  );
}
