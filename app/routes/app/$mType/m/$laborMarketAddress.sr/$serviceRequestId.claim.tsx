import { useParams } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { SendTransactionResult } from "@wagmi/core";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { Modal } from "~/components";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import type { ClaimToSubmitPrepared } from "~/domain";
import ConnectWalletWrapper from "~/features/connect-wallet-wrapper";
import { RPCError } from "~/features/rpc-error";
import { ClaimToSubmitWeb3Button } from "~/features/web3-button/claim-to-submit";
import type { EthersError } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { findServiceRequest } from "~/services/service-request.server";
import { REPUTATION_SIGNAL_STAKE } from "~/utils/constants";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { serviceRequestId, laborMarketAddress } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  if (!serviceRequest) {
    throw notFound({ id: serviceRequestId });
  }

  return typedjson({ serviceRequest }, { status: 200 });
};

const claimToSubmitMachine = createBlockchainTransactionStateMachine<ClaimToSubmitPrepared>();

export default function ClaimToSubmit() {
  const { serviceRequest } = useTypedLoaderData<typeof loader>();
  const { mType } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleClaimToSubmit = () => {
    send({ type: "RESET_TRANSACTION" });
    send({
      type: "PREPARE_TRANSACTION_READY",
      data: {
        laborMarketAddress: serviceRequest.laborMarketAddress,
        serviceRequestId: serviceRequest.id,
      },
    });
    setIsModalOpen(true);
  };

  const onWriteSuccess = (result: SendTransactionResult) => {
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
  };

  return (
    <Container className="max-w-4xl space-y-7 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Claim to Submit on {serviceRequest.appData?.title}</h1>
        <h2 className="text-lg text-cyan-500">
          Claiming is an up front commitment to submit at least one
          {mType === "brainstorm" ? "submission" : "dashboard"}
        </h2>
        <p className="text-gray-500 text-sm">
          You must temporarily lock rMETRIC to claim. If you claim and don't submit before the deadline, all your locked
          rMETRIC will be slashed.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">How Claiming to Submit Works</h3>
        <ul className="list-disc list-inside text-gray-500 space-y-1 text-sm">
          <li>Commit to entering at least one submission by locking rMETRIC against this challenge</li>
          <li>Enter at least one submission before the submission deadline</li>
          <li>If you submit before the deadline, your rMETRIC will be unlocked</li>
          <li>If you don't submit before the deadline, all your locked rMETRIC will be slashed</li>
        </ul>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-5">
          <div className="space-y-2">
            <h2 className="font-semibold pr-10">Claim to Submit Deadline</h2>
            <CountdownCard
              start={serviceRequest.createdAtBlockTimestamp}
              end={serviceRequest.configuration?.signalExpiration}
            />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold pr-16">Submission Deadline</h2>
            <CountdownCard
              start={serviceRequest.createdAtBlockTimestamp}
              end={serviceRequest.configuration?.submissionExpiration}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Lock rMETRIC</h2>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <p className="text-sm">
            You must lock <Badge>{REPUTATION_SIGNAL_STAKE}</Badge> rMETRIC to claim
          </p>
        </div>
        <p className="mt-2 text-gray-500 italic text-sm">
          Important: If you don't submit before the deadline, all {REPUTATION_SIGNAL_STAKE} of your locked rMETRIC will
          be slashed.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        <ConnectWalletWrapper>
          <Button onClick={handleClaimToSubmit}>
            <span> Claim to Submit</span>
          </Button>
        </ConnectWalletWrapper>
        <Button variant="cancel">Cancel</Button>
      </div>
      <div className="invisible"></div>
      {state.context.contractData && (
        <Modal
          title="Claim to Submit"
          isOpen={isModalOpen && !state.matches("transactionWait")}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-8">
            <p>Please confirm that you would like to claim a submission.</p>
            {error && <RPCError error={error} />}
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              {!error && (
                <ClaimToSubmitWeb3Button
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
