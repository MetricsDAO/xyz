import { Title, Text, List, Button, Paper } from "@mantine/core";

export default function ClaimToSubmit() {
  return (
    <div className="container mx-auto px-10 max-w-5xl space-y-7">
      <Title order={2} weight={600}>
        {"Claim {Topic} to Submit"}
      </Title>
      <Text>
        Claiming is an up front commitment to submit at least one question idea on a topic. Having at least one claim on
        a topic also ensures the topic sponsor can’t cancel it once work has started. To claim, you must stake your
        reputation by locking xMETRIC.
      </Text>
      <Title order={4}>How Claims Work</Title>
      <List withPadding>
        <List.Item>Commit to submitting at least one question by locking xMETRIC against this topic</List.Item>
        <List.Item>Submit at least one question before the submission deadline</List.Item>
        <List.Item>If you submit before the deadline, your xMETRIC will be unlocked</List.Item>
        <List.Item>If you claim and don’t submit, your xMETRIC will be slashed</List.Item>
      </List>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-5 gap-y-16 lg:mr-24">
        <div className="lg:col-span-2 space-y-2">
          <Title order={4}>Claim Deadline</Title>
          <Paper p="sm" withBorder className="text-[#858582] w-full col-span-2">
            <Text>4d 2h 3m</Text>
          </Paper>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <Title order={4}>Submit Deadline</Title>
          <Paper p="sm" withBorder className="text-[#858582] w-full col-span-2">
            <Text>4d 2h 3m</Text>
          </Paper>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <Title order={4}>Lock xMetric</Title>
          <Paper p="sm" withBorder className="text-[#858582] w-full col-span-2">
            <Text>You must lock 10 xMetric to claim</Text>
          </Paper>
        </div>
        <Button color="dark" size="lg" className="self-end">
          Lock xMetric
        </Button>
        <br className="hidden lg:block" />
        <Button variant="default" color="dark" size="lg">
          Cancel
        </Button>
        <Button color="dark" size="lg">
          Claim Topic
        </Button>
      </div>
    </div>
  );
}
