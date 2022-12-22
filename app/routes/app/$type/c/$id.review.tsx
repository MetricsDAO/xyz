import { withZod } from "@remix-validated-form/with-zod";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { ValidatedSegmentedRadio } from "~/components";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import { useClaimToReview } from "~/hooks/use-claim-to-review";
import { findChallenge } from "~/services/challenges-service.server";
import invariant from "tiny-invariant";
import { toast } from "react-hot-toast";
import type { DataFunctionArgs } from "@remix-run/node";
import { ValidatedForm } from "remix-validated-form";
import type { ClaimToReviewPrepared } from "~/domain";
import { ClaimToReviewPreparedSchema } from "~/domain";
import { useState } from "react";

const paramsSchema = z.object({ id: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { id } = paramsSchema.parse(params);
  const challenge = await findChallenge(id);
  if (!challenge) {
    throw notFound({ id });
  }

  return typedjson({ challenge }, { status: 200 });
};

const validator = withZod(ClaimToReviewPreparedSchema);

export default function ClaimToReview() {
  const { challenge } = useTypedLoaderData<typeof loader>();

  const [formData, setFormData] = useState<ClaimToReviewPrepared>({ quantity: 0 });

  return (
    <Container className="py-16">
      <ValidatedForm
        onSubmit={(data) => {
          setFormData(data);
        }}
        validator={validator}
        className="mx-auto px-10 max-w-4xl space-y-7 mb-12"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{`Claim to Review ${challenge.title}`}</h1>
          <p className="text-cyan-500 text-lg">
            Claiming is an up front commitment to review and score a minumum number of submissions
          </p>
          <p className="text-gray-500">
            You must temporarily lock rMETRIC to claim. If you claim and don’t complete review before the deadline, 5
            rMETRIC will be slashed for each submission you fail to review.
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
          <ValidatedSegmentedRadio
            name="quantity"
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
          <h2 className="text-lg font-semibold">Lock rMETRIC</h2>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <p>
              You must lock <Badge>{formData.quantity * 5}</Badge> rMETRIC to claim
            </p>
            <Button variant="outline">Lock rMETRIC</Button>
          </div>
          <p className="mt-2 text-gray-500 italic">
            Important: 5 rMETRIC will be slashed for each submission you fail to review before the deadline.
          </p>
        </div>
        <ConfirmTransaction ClaimToReview={formData} />
      </ValidatedForm>
    </Container>
  );
}

function ConfirmTransaction({ ClaimToReview }: { ClaimToReview?: ClaimToReviewPrepared }) {
  invariant(ClaimToReview, "A number of submissions to review is required"); // this should never happen but just in case

  const { write, isLoading } = useClaimToReview({
    data: ClaimToReview,
    onTransactionSuccess() {
      toast.dismiss("claiming-to-review");
      toast.success("Submissions Claimed!");
    },
    onWriteSuccess() {
      toast.loading("Claiming Submissions to review...", { id: "claiming-to-review" });
    },
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <div className="flex flex-wrap gap-5">
      <Button onClick={onCreate} loading={isLoading} type="submit">
        Claim to Review
      </Button>
      <Button variant="cancel">Cancel</Button>
    </div>
  );
}
