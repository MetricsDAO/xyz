import { Title, Text, List, Button, Badge } from "@mantine/core";
import { CountDown } from "~/components/CountDown";

export default function ClaimToSubmit() {
  return (
    <div className="container mx-auto px-10 max-w-4xl space-y-7 mb-12 pt-12">
      <div className="space-y-2">
        <Title order={2} weight={600}>
          {"Claim to Submit on {Challenge title}"}
        </Title>
        <div>
          <Title order={4} color="blue" weight={400}>
            {"Claiming is an up front commitment to submit at least one submission"}
          </Title>
          <Text color="dimmed">
            You must temporarily lock xMETRIC to claim. If you claim and don’t submit before the deadline, all your
            locked xMETRIC will be slashed.
          </Text>
        </div>
      </div>
      <div className="space-y-2">
        <Title order={4}>How Claims Work</Title>
        <List withPadding>
          <List.Item>Commit to entering at least one submission by locking xMETRIC against this challenge</List.Item>
          <List.Item>Enter at least one submission before the submission deadline</List.Item>
          <List.Item>If you submit before the deadline, your xMETRIC will be unlocked</List.Item>
          <List.Item>If you don’t submit before the deadline, all your locked xMETRIC will be slashed</List.Item>
        </List>
      </div>
      <div className="flex">
        <div className="lg:basis-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-16 lg:mr-24">
          <div className="space-y-2">
            <Title order={4}>Claim Deadline</Title>
            <CountDown progress={64} time="42d 3h 22m" />
          </div>
          <div className="space-y-2">
            <Title order={4}>Submit Deadline</Title>
            <CountDown progress={22} time="42d 3h 22m" />
          </div>
        </div>
      </div>
      <div>
        <Title order={4}>Lock xMetric</Title>
        <div className="flex flex-col md:flex-row space-y-2 md:space-x-5">
          <div className="flex flex-wrap gap-1 items-center">
            <Text>You must lock </Text>
            <Badge radius="sm" color="dark">
              10
            </Badge>
            <Text> xMetric to claim</Text>
          </div>
          <Button radius="md" variant="outline" size="lg" className="self-start">
            Lock xMetric
          </Button>
        </div>
        <Text italic color="dimmed" className="mt-2">
          If you claim and don’t submit before the deadline, all your locked xMETRIC will be slashed
        </Text>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button radius="md" size="lg">
          Claim to Submit
        </Button>
        <Button radius="md" variant="default" color="dark" size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}
