import { Button, Textarea, TextInput, Text, Title, Paper } from "@mantine/core";

export default function SubmitQuestion() {
  return (
    <div className="container mx-auto px-10 space-y-3 mb-12">
      <div className="flex flex-col-reverse justify-center lg:flex-row  space-y-reverse space-y-8 lg:space-y-0 lg:space-x-16">
        <main className="lg:max-w-xl space-y-7">
          <div>
            <Title order={2} weight={600} className="mb-1">
              {"Submit Question"}
            </Title>
            <Title order={4} color="brand.4" weight={400}>
              {"Brainstorm the best question for crypto analysts to answer about {Challenge title}"}
            </Title>
            <Text color="dimmed">
              Submit your best question idea. Peers will review and score your question. If you’re a winner, you’ll earn
              tokens and xMETRIC from the challenge reward pool!
            </Text>
          </div>
          <TextInput
            label="Question Title"
            size="md"
            radius="md"
            placeholder="Question title"
            className="mt-1 w-full"
          />
          <div className="space-y-3">
            <Textarea
              label="What's your question?"
              placeholder="Don’t assume we will “know what you mean.” Be specific. Define metrics. Specify time boundaries."
              className="text-black w-full md:col-span-2"
              size="md"
              radius="sm"
              autosize
              spellCheck="true"
              minRows={5}
              maxRows={10}
            />
            <Text italic color="dimmed">
              Important: You can’t edit this question after submitting. Double check your work for typos and ensure your
              question is good to go.
            </Text>
          </div>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <Button radius="md" size="md">
              Submit Question
            </Button>
            <Button radius="md" variant="default" color="dark" size="md">
              Cancel
            </Button>
          </div>
        </main>
        <aside className="lg:basis-1/3 ">
          <Paper p="md" withBorder sx={{ backgroundColor: "#E7F5FF" }} radius="md">
            <Text color="dimmed" className="space-y-6">
              <div className="space-y-3">
                <Text color="dark" weight={700}>
                  Be specific:
                </Text>
                <Text>"How many people actively use Sushi?"</Text>
                <Text>
                  The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are
                  we talking Ethereum? What about Polygon?
                </Text>
                <Text weight={500} italic>
                  UPDATE: How many addresses actively use the SUSHI token on Ethereum?{" "}
                </Text>
              </div>
              <div className="space-y-3">
                <Text color="dark" weight={700}>
                  Define metrics:
                </Text>
                <Text>
                  What is “active“? What is “use”? These terms can (and will) mean different things to different people.
                  It doesn’t matter what definition you use as long as you communicate your expectations. Alternatively,
                  you can ask for the metric to be defined as part of the question.
                </Text>
                <Text weight={500} italic>
                  UPDATE: How many addresses have transferred SUSHI on Ethereum?
                </Text>
              </div>
              <div className="space-y-3">
                <Text color="dark" weight={700}>
                  Specify time boundaries:
                </Text>
                <Text>
                  We still haven’t fully defined “active”. Specifying time makes the result easier to understand, don’t
                  rely on the person answering the question to specify time for you if you didn’t ask them to.
                </Text>
                <Text weight={500} italic>
                  UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?
                </Text>
              </div>
            </Text>
          </Paper>
        </aside>
      </div>
    </div>
  );
}
