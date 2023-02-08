import type { DataFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { Error, Modal, ValidatedSegmentedRadio } from "~/components";
import { useMachine } from "@xstate/react";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import type { ClaimToReviewContract, ClaimToReviewForm } from "~/domain";
import { ClaimToReviewFormSchema } from "~/domain";
import type { SendTransactionResult } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { findServiceRequest } from "~/services/service-request.server";
import { claimToReviewDate } from "~/utils/date";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { ClaimToReviewWeb3Button } from "~/features/web3-button/claim-to-review";

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { laborMarketAddress, serviceRequestId } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  if (!serviceRequest) {
    throw notFound({ serviceRequestId });
  }

  return typedjson({ serviceRequest }, { status: 200 });
};

const claimToSubmitMachine = createBlockchainTransactionStateMachine<ClaimToReviewContract>();

const validator = withZod(ClaimToReviewFormSchema);

export default function ClaimToReview() {
  const { serviceRequest } = useTypedLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [state, send] = useMachine(claimToSubmitMachine, {
    actions: {
      notifyTransactionWait: (context) => {
        defaultNotifyTransactionActions.notifyTransactionWait(context);
      },
      notifyTransactionSuccess: (context) => {
        defaultNotifyTransactionActions.notifyTransactionSuccess(context);
      },
      notifyTransactionFailure: () => {
        defaultNotifyTransactionActions.notifyTransactionFailure();
      },
    },
  });

  function handleClaimToReview(data: ClaimToReviewForm) {
    send({ type: "RESET_TRANSACTION" });
    send({
      type: "PREPARE_TRANSACTION_READY",
      data: {
        laborMarketAddress: serviceRequest.address,
        serviceRequestId: serviceRequest.id,
        quantity: data.quantity,
      },
    });
    setIsModalOpen(true);
  }

  const onWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  return (
    <Container className="py-16">
      <ValidatedForm
        onSubmit={(data) => {
          handleClaimToReview(data);
        }}
        validator={validator}
        className="mx-auto px-10 max-w-4xl space-y-7 mb-12"
      >
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
              start={serviceRequest.blockTimestamp}
              end={claimToReviewDate(serviceRequest.blockTimestamp, serviceRequest.configuration.enforcementExpiration)}
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">Review Deadline</h2>
            <CountdownCard
              start={serviceRequest.blockTimestamp}
              end={serviceRequest.configuration?.enforcementExpiration}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">How many submissions do you commit to reviewing at a minimum?</h2>
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
          <Error name="quantity" />
          <p className="text-gray-500 italic mt-2 text-sm">
            You're only required to review the minimum you commit to, but you can optionally review more
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Lock rMETRIC</h2>
          {/* Revisit later: might not make sense w/ protocol
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <p className="text-sm">
              You must lock{" "}
              {state.context.contractData?.quantity ? <Badge>{state.context.contractData?.quantity * 5}</Badge> : null}{" "}
              rMETRIC to claim
            </p>
            <Button variant="outline">Lock rMETRIC</Button>
          </div>*/}
          <p className="mt-2 text-gray-500 italic text-sm">
            Important: 5 rMETRIC will be slashed for each submission you fail to review before the deadline.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Button type="submit">Claim to Review</Button>
          <Button variant="cancel">Cancel</Button>
        </div>
      </ValidatedForm>
      {state.context.contractData && (
        <Modal
          title="Claim to Review"
          isOpen={isModalOpen && !state.matches("transactionWait")}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-8">
            <p>
              Please confirm that you would like to claim {state.context.contractData.quantity} submissions to review.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <ClaimToReviewWeb3Button data={state.context.contractData} onWriteSuccess={onWriteSuccess} />
              <Button variant="cancel" size="md" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}
