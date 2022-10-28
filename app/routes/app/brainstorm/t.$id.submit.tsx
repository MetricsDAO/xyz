import { Button, List, Textarea, TextInput, Text, Title, Paper } from "@mantine/core";

export default function SubmitQuestion() {
  return (
    <div className="container mx-auto px-10 space-y-3">
      <div className="flex flex-col md:flex-row md:space-x-5">
        <div className="hidden md:block md:basis-1/5" />
        <div className="md:basis-3/5 space-y-7">
          <div>
            <Title order={2} weight={600} className="mb-1">
              {"Submit Question"}
            </Title>
            <Title order={3} color="cyan.3" weight={400}>
              {"Brainstorm the best question for crypto analysts to answer about {Challenge title}"}
            </Title>
            <Text className="text-[#A5A5A5]">
              Submit your best questions. Peers will review your question. If you’re a winner, you’ll earn tokens from
              the reward pool!
            </Text>
          </div>
          <div className="max-w-md space-y-7">
            <TextInput label="Question Title" size="md" placeholder="Question title" className="mt-1 w-full" />
            <div className="space-y-3">
              <Textarea
                label="What's your question?"
                placeholder=""
                className="text-black w-full md:col-span-2"
                size="md"
                autosize
                spellCheck="true"
                minRows={5}
                maxRows={10}
              />
              <Text italic className="text-[#A5A5A5]">
                Important: Questions can’t be edited once submitted. Double check your work for typos and ensure your
                question is good to go.
              </Text>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <Button color="cyan.3" size="md">
              Submit Question
            </Button>
            <Button variant="default" color="dark" size="md">
              Cancel
            </Button>
          </div>
        </div>
        <div className="md:basis-1/5">
          <Paper p="md" radius="md" withBorder className="text-[#909296] space-y-6">
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
