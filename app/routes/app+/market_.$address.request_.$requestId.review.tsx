import type { DataFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { ValidatedError, Modal, ValidatedSegmentedRadio } from "~/components";
import { useMachine } from "@xstate/react";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import type { ClaimToReviewContract, ClaimToReviewForm } from "~/domain";
import { ClaimToReviewFormSchema } from "~/domain";
import type { EthersError, SendTransactionResult } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { findServiceRequest } from "~/domain/service-request/functions.server";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import { ClaimToReviewWeb3Button } from "~/features/web3-button/claim-to-review";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { REPUTATION_REVIEW_SIGNAL_STAKE } from "~/utils/constants";
import { claimToReviewDeadline } from "~/utils/helpers";
import { RPCError } from "~/features/rpc-error";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";

const paramsSchema = z.object({ address: z.string(), requestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { address, requestId } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  const laborMarket = await getIndexedLaborMarket(address as `0x${string}`);
  if (!serviceRequest) {
    throw notFound({ requestId });
  }
  if (!laborMarket) {
    throw notFound({ address });
  }

  return typedjson({ serviceRequest, laborMarket }, { status: 200 });
};

const claimToSubmitMachine = createBlockchainTransactionStateMachine<ClaimToReviewContract>();

const validator = withZod(ClaimToReviewFormSchema);

export default function ClaimToReview() {
  const { serviceRequest, laborMarket } = useTypedLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const mType = laborMarket.appData?.type;
  invariant(mType, "marketplace type must be specified");

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
        laborMarketAddress: serviceRequest.laborMarketAddress,
        serviceRequestId: serviceRequest.id,
        quantity: data.quantity,
      },
    });
    setIsModalOpen(true);
  }

  const onWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
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
            <CountdownCard start={serviceRequest.createdAtBlockTimestamp} end={claimToReviewDeadline(serviceRequest)} />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">Review Deadline</h2>
            <CountdownCard
              start={serviceRequest.createdAtBlockTimestamp}
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
          <ValidatedError name="quantity" />
          <p className="text-gray-500 italic mt-2 text-sm">
            You're only required to review the minimum you commit to, but you can optionally review more
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Lock rMETRIC</h2>
          <p className="mt-2 text-gray-500 italic text-sm">
            Important: You must lock {REPUTATION_REVIEW_SIGNAL_STAKE} rMETRIC for each submission to commit to reviewing
            and {REPUTATION_REVIEW_SIGNAL_STAKE} rMETRIC will be slashed for each submission to fail to review before
            the deadline.
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <ConnectWalletWrapper>
            <Button type="submit">
              <span>Claim to Review</span>
            </Button>
          </ConnectWalletWrapper>
          <Button variant="cancel" asChild>
            <Link to={`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}}`}>Cancel</Link>
          </Button>
        </div>
      </ValidatedForm>
      {state.context.contractData && (
        <Modal
          title="Claim to Review"
          isOpen={isModalOpen && !state.matches("transactionWait")}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-8">
            <p className="mt-2">
              Please confirm that you would like to claim {state.context.contractData.quantity} submissions to review.
            </p>
            <p>
              This will lock <b>{state.context.contractData.quantity * REPUTATION_REVIEW_SIGNAL_STAKE} rMETRIC.</b>
            </p>
            {error && <RPCError error={error} />}
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              {!error && (
                <ClaimToReviewWeb3Button
                  data={state.context.contractData}
                  onWriteSuccess={onWriteSuccess}
                  onPrepareTransactionError={onPrepareTransactionError}
                />
              )}
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
