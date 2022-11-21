import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/button";
import { ButtonSelect } from "~/components/ButtonSelect";
import { Container } from "~/components/Container";
import { CountdownCard } from "~/components/countdown-card";
import { findChallenge } from "~/services/challenges-service.server";

const paramsSchema = z.object({ id: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);
  const challenge = await findChallenge(id);
  if (!challenge) {
    throw notFound({ id });
  }

  return typedjson({ challenge }, { status: 200 });
};

export default function ClaimToReview() {
  const { challenge } = useTypedLoaderData<typeof loader>();

  return (
    <Container>
      <ValidatedForm validator={withZod(z.any())} className="space-y-7 max-w-4xl mx-auto mt-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{`Claim to Review ${challenge.title}`}</h1>
          <p className="text-cyan-500 text-lg">
            Claiming is an up front commitment to review and score a minumum number of submissions
          </p>
          <p className="text-gray-500">
            You must temporarily lock xMETRIC to claim. If you claim and don’t complete review before the deadline, 5
            xMETRIC will be slashed for each submission you fail to review.
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">How Claiming to Review Works</h2>

          <ul className="list-disc list-inside text-gray-500 space-y-1">
            <li>Commit to reviewing a minimum number of submissions by locking rMETRIC against this challenge</li>
            <li>Review the minimum number of submissions you committed to before the review deadline</li>
            <li>If you complete review before the deadline, your rMETRIC will be unlocked</li>
            <li>If you don't complete review before the deadline, a portion of your locked rMETRIC will be slashed</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Claim to Review Deadline</h2>
            <CountdownCard start={"2022-11-25"} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Review Deadline</h2>
            <CountdownCard start={"2022-12-25"} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">How many submissions do you commit to reviewing at a minimum?</h2>
          <ButtonSelect
            name="numOfSubmissions"
            options={[
              { label: "10", value: "10" },
              { label: "25", value: "25" },
              { label: "50", value: "50" },
              { label: "75", value: "75" },
              { label: "100", value: "100" },
            ]}
          />
          <p className="text-gray-500 italic mt-2">
            You're only required to review the minimum you commit to, but you can optionally review more
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Lock xMetric</h2>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <p>
              You must lock <Badge>50</Badge> xMetric to claim
            </p>
            <Button variant="outline">Lock xMetric</Button>
          </div>
          <p className="mt-2 text-gray-500 italic">
            Important: 5 xMETRIC will be slashed for each submission you fail to review before the deadline.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Button>Claim to Review</Button>
          <Button variant="cancel">Cancel</Button>
        </div>
      </ValidatedForm>
    </Container>
  );
}
