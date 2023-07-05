import { Controller, useFormContext } from "react-hook-form";
import { Error, Field, Input, Label } from "~/components";
import { CountdownCard } from "~/components/countdown-card";
import type { ServiceRequestDoc } from "~/domain/service-request/schemas";
import { REPUTATION_REVIEW_SIGNAL_STAKE } from "~/utils/constants";
import { claimToReviewDeadline } from "~/utils/helpers";
import type { ClaimToReviewFormValues } from "./claim-to-review-creator-values";

export function ClaimToReviewCreatorFields({ serviceRequest }: { serviceRequest: ServiceRequestDoc }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ClaimToReviewFormValues>();

  const claimedReviews =
    serviceRequest.indexData.claimsToReview.length > 0
      ? serviceRequest.indexData.claimsToReview.reduce((sum, claim) => sum + claim.signalAmount, 0)
      : 0;
  const numClaimsRemaining = serviceRequest.configuration.reviewerLimit - claimedReviews;

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{`Claim to Review ${serviceRequest.appData?.title}`}</h1>
        <p className="text-cyan-500 text-lg">
          Claiming is an up front commitment to review and score a minimum number of submissions
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-5">
        <div className="space-y-2">
          <h2 className="font-semibold">Claim to Review Deadline</h2>
          <CountdownCard start={serviceRequest.blockTimestamp} end={claimToReviewDeadline(serviceRequest)} />
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Review Deadline</h2>
          <CountdownCard start={serviceRequest.blockTimestamp} end={serviceRequest.configuration?.enforcementExp} />
        </div>
      </div>
      <div className="space-y-2">
        <Field>
          <Label size="lg">How many submissions do you commit to reviewing at a minimum?</Label>
          <p className="text-gray-500 text-sm">There are {numClaimsRemaining} available to claim</p>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => <Input {...field} type="number" name="quantity" max={numClaimsRemaining} />}
          />
          <Error error={errors.quantity?.message} />
        </Field>

        <p className="text-gray-500 italic mt-2 text-sm">
          You're only required to review the minimum you commit to, but you can optionally review more
        </p>
      </div>
    </>
  );
}
