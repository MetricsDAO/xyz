import { Title, Text, List, Button, Paper } from "@mantine/core";

export default function ClaimToSubmit() {
  return (
    <div className="container mx-auto px-10 max-w-5xl space-y-7">
      <div>
        <Title order={2} weight={600} className="mb-1">
          {"Claim to Submit on {Challenge title}"}
        </Title>
        <Title order={3} color="cyan.3" weight={400}>
          {"Claiming is an up front commitment to submit at least one submission"}
        </Title>
        <Text className="text-[#A5A5A5]">
          You must lock xMETRIC to claim. If you don’t submit before the deadline, all your locked xMETRIC will be
          slashed
        </Text>
      </div>
      <div className="space-y-2">
        <Title order={4}>How Claims Work</Title>
        <List withPadding>
          <List.Item>Commit to submitting at least one question by locking xMETRIC against this topic</List.Item>
          <List.Item>Submit at least one question before the submission deadline</List.Item>
          <List.Item>If you submit before the deadline, your xMETRIC will be unlocked</List.Item>
          <List.Item>If you claim and don’t submit, your xMETRIC will be slashed</List.Item>
        </List>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-16 lg:mr-24">
        <div className="space-y-2">
          <Title order={4}>Claim Deadline</Title>
          <Text>4d 2h 3m</Text>
        </div>
        <div className="space-y-2">
          <Title order={4}>Submit Deadline</Title>
          <Text>4d 2h 3m</Text>
        </div>
      </div>
      <Title order={4}>Lock xMetric</Title>
      <div className="flex flex-col md:flex-row space-y-2 md:space-x-5">
        <Paper p="sm" radius="md" withBorder className="text-[#858582]">
          <Text>You must lock 10 xMetric to claim</Text>
        </Paper>
        <Button color="dark" size="lg" className="self-end">
          Lock xMetric
        </Button>
      </div>
      <Text italic className="text-[#A5A5A5]">
        If you claim and don’t submit before the deadline, all your locked xMETRIC will be slashed
      </Text>
      <div className="flex flex-col md:flex-row gap-5">
        <Button color="dark" size="lg">
          Claim to Review
        </Button>
        <Button variant="default" color="dark" size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}
