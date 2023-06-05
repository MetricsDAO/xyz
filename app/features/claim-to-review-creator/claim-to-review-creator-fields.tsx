import { Controller, useFormContext } from "react-hook-form";
import { Error, Field, Label, SegmentedRadio } from "~/components";
import { CountdownCard } from "~/components/countdown-card";
import type { ServiceRequestDoc } from "~/domain/service-request/schemas";
import { REPUTATION_REVIEW_SIGNAL_STAKE } from "~/utils/constants";
import { claimToReviewDeadline, serviceRequestCreatedDate } from "~/utils/helpers";
import type { ClaimToReviewFormValues } from "./claim-to-review-creator-values";

export function ClaimToReviewCreatorFields({ serviceRequest }: { serviceRequest: ServiceRequestDoc }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ClaimToReviewFormValues>();

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{`Claim to Review ${serviceRequest.appData?.title}`}</h1>
        <p className="text-cyan-500 text-lg">
          Claiming is an up front commitment to review and score a minimum number of submissions
        </p>
        <p className="text-gray-500 text-sm">
          You must temporarily lock rMETRIC to claim. If you claim and don’t complete review before the deadline, 5
          rMETRIC will be slashed for each submission you fail to review.
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">How Claiming to Review Works</h2>

        <ul className="list-disc list-inside text-gray-500 space-y-1 text-sm">
          <li>Commit to reviewing a minimum number of submissions by locking rMETRIC against this challenge</li>
          <li>Review the minimum number of submissions you committed to before the review deadline</li>
          <li>If you complete review before the deadline, your rMETRIC will be unlocked</li>
          <li>If you don't complete review before the deadline, a portion of your locked rMETRIC will be slashed</li>
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-5">
        <div className="space-y-2">
          <h2 className="font-semibold">Claim to Review Deadline</h2>
          <CountdownCard
            start={serviceRequestCreatedDate(serviceRequest)}
            end={claimToReviewDeadline(serviceRequest)}
          />
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Review Deadline</h2>
          <CountdownCard
            start={serviceRequestCreatedDate(serviceRequest)}
            end={serviceRequest.configuration?.enforcementExp}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Field>
          <Label size="lg">How many submissions do you commit to reviewing at a minimum?</Label>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <SegmentedRadio
                {...field}
                name="quantity"
                options={[
                  { label: "10", value: "10" },
                  { label: "25", value: "25" },
                  { label: "50", value: "50" },
                  { label: "75", value: "75" },
                  { label: "100", value: "100" },
                ]}
              />
            )}
          />
          <Error error={errors.quantity?.message} />
        </Field>

        <p className="text-gray-500 italic mt-2 text-sm">
          You're only required to review the minimum you commit to, but you can optionally review more
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Lock rMETRIC</h2>
        <p className="mt-2 text-gray-500 italic text-sm">
          Important: You must lock {REPUTATION_REVIEW_SIGNAL_STAKE} rMETRIC for each submission to commit to reviewing
          and {REPUTATION_REVIEW_SIGNAL_STAKE} rMETRIC will be slashed for each submission to fail to review before the
          deadline.
        </p>
      </div>
    </>
  );
}
