import { Title, Text, List, Button, Badge } from "@mantine/core";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { findChallenge } from "~/services/challenges-service.server";
import { CountDownCard } from "~/components/CountDownCard";

const paramsSchema = z.object({ id: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);
  const challenge = await findChallenge(id);
  if (!challenge) {
    throw notFound({ id });
  }

  return typedjson({ challenge }, { status: 200 });
};
export default function ClaimToSubmit() {
  const { challenge } = useTypedLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-10 max-w-4xl space-y-7 mb-12">
      <div className="space-y-2">
        <Title order={2} weight={600}>
          {`Claim to Submit on ${challenge.title}`}
        </Title>
        <div>
          <Title order={4} color="brand.4" weight={400}>
            {"Claiming is an up front commitment to submit at least one submission"}
          </Title>
          <Text color="dimmed">
            You must temporarily lock xMETRIC to claim. If you claim and don’t submit before the deadline, all your
            locked xMETRIC will be slashed.
          </Text>
        </div>
      </div>
      <div className="space-y-2">
        <Title order={4}>How Claiming to Submit Works</Title>
        <List withPadding>
          <List.Item>Commit to entering at least one submission by locking xMETRIC against this challenge</List.Item>
          <List.Item>Enter at least one submission before the submission deadline</List.Item>
          <List.Item>If you submit before the deadline, your xMETRIC will be unlocked</List.Item>
          <List.Item>If you don’t submit before the deadline, all your locked xMETRIC will be slashed</List.Item>
        </List>
      </div>
      <div className="flex">
        <div className="lg:basis-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Title order={4}>Claim to Submit Deadline</Title>
            <CountDownCard progress={64} time={"2023-01-25"} />
          </div>
          <div className="space-y-2">
            <Title order={4}>Submission Deadline</Title>
            <CountDownCard progress={22} time={"2022-11-25"} />
          </div>
        </div>
      </div>
      <div>
        <Title order={4}>Lock xMetric</Title>
        <div className="flex flex-col md:flex-row space-y-2 md:space-x-5 items-center">
          <Text>
            You must lock
            <Badge radius="sm" color="dark" className="mt-1">
              10
            </Badge>
            xMetric to claim
          </Text>
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
