import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { findChallenge } from "~/services/challenges-service.server";
import { Container } from "~/components/Container";
import { CountdownCard } from "~/components/countdown-card";
import { Button } from "~/components/button";
import { Badge } from "~/components/Badge";

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
    <Container className="max-w-4xl space-y-7 mb-12 mt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Claim to Submit on {challenge.title}</h1>
        <h2 className="text-xl text-cyan-500">Claiming is an up front commitment to submit at least one submission</h2>
        <p className="text-gray-500">
          You must temporarily lock rMETRIC to claim. If you claim and don't submit before the deadline, all your locked
          rMETRIC will be slashed.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">How Claiming to Submit Works</h3>
        <ul className="list-disc list-inside text-gray-500 space-y-1">
          <li>Commit to entering at least one submission by locking rMETRIC against this challenge</li>
          <li>Enter at least one submission before the submission deadline</li>
          <li>If you submit before the deadline, your rMETRIC will be unlocked</li>
          <li>If you don't submit before the deadline, all your locked rMETRIC will be slashed</li>
        </ul>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Claim to Submit Deadline</h2>
            <CountdownCard start={"2023-01-25"} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Submission Deadline</h2>
            <CountdownCard start={"2022-11-25"} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Lock rMetric</h2>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <p>
            You must lock <Badge>50</Badge> rMetric to claim
          </p>
          <Button variant="outline">Lock rMetric</Button>
        </div>
        <p className="mt-2 text-gray-500 italic">
          Important: If you don't submit before the deadline, all 50 of your locked rMETRIC will be slashed.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button>Claim to Submit</Button>
        <Button variant="cancel">Cancel</Button>
      </div>
    </Container>
  );
}
