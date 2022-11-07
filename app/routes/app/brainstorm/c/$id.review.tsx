import { Title, Text, List, Button, Badge, SegmentedControl } from "@mantine/core";
import { CountDown } from "~/components/CountDown";

export default function ClaimToReview() {
  return (
    <div className="container mx-auto px-10 max-w-4xl space-y-7 mb-12">
      <div className="space-y-2">
        <Title order={2} weight={600}>
          {"Claim to Review {Challenge title}"}
        </Title>
        <div>
          <Title order={4} color="blue" weight={400}>
            {"Claiming is an up front commitment to review and score a minumum number of submissions"}
          </Title>
          <Text color="dimmed">
            You must temporarily lock xMETRIC to claim. If you claim and don’t complete review before the deadline, 5
            xMETRIC will be slashed for each submission you fail to review.
          </Text>
        </div>
      </div>
      <div className="space-y-2">
        <Title order={4}>How Claiming to Review Works</Title>
        <List withPadding>
          <List.Item>
            Commit to reviewing a minimum number of submissions by locking xMETRIC against this challenge
          </List.Item>
          <List.Item>Review the minimum number of submissions you committed to before the review deadline</List.Item>
          <List.Item>If you complete review before the deadline, your xMETRIC will be unlocked</List.Item>
          <List.Item>
            If you don’t complete review before the deadline, a portion of your locked xMETRIC will be slashed
          </List.Item>
        </List>
      </div>
      <div className="flex">
        <div className="lg:basis-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Title order={4}>Claim to Review Deadline</Title>
            <CountDown progress={64} time="42d 3h 22m" />
          </div>
          <div className="space-y-2">
            <Title order={4}>Review Deadline</Title>
            <CountDown progress={22} time="42d 3h 22m" />
          </div>
        </div>
      </div>
      <div>
        <Title order={4}>How many submissions do you commit to reviewing at a minimum?</Title>
        <SegmentedControl
          className="mt-2"
          transitionDuration={500}
          fullWidth
          transitionTimingFunction="linear"
          data={[
            { value: "10", label: "10" },
            { value: "25", label: "25" },
            { value: "50", label: "50" },
            { value: "75", label: "75" },
            { value: "100", label: "100" },
          ]}
        />
        <Text italic color="dimmed" className="mt-2">
          You’re only required to review the minimum you commit to, but you can optionally review more
        </Text>
      </div>
      <div>
        <Title order={4}>Lock xMetric</Title>
        <div className="flex flex-col md:flex-row space-y-2 md:space-x-5 items-center">
          <Text>
            You must lock{" "}
            <Badge radius="sm" color="dark" className="mt-1">
              50
            </Badge>{" "}
            xMetric to claim
          </Text>
          <Button radius="md" variant="outline" size="lg" className="self-start">
            Lock xMetric
          </Button>
        </div>
        <Text italic color="dimmed" className="mt-2">
          Important: 5 xMETRIC will be slashed for each submission you fail to review before the deadline.
        </Text>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button radius="md" size="lg">
          Claim to Review
        </Button>
        <Button radius="md" variant="default" color="dark" size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}
