import { Link } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { SendTransactionResult } from "@wagmi/core";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { Modal } from "~/components";
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
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import invariant from "tiny-invariant";
import { getIndexedLaborMarket } from "~/domain/labor-market/functions.server";

const paramsSchema = z.object({ address: z.string(), requestId: z.string() });
export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { requestId, address } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(requestId, address);
  const laborMarket = await getIndexedLaborMarket(address);
  if (!serviceRequest) {
    throw notFound({ id: requestId });
  }
  if (!laborMarket) {
    throw notFound({ address });
  }

  return typedjson({ serviceRequest, laborMarket }, { status: 200 });
};

const claimToSubmitMachine = createBlockchainTransactionStateMachine<ClaimToSubmitPrepared>();

export default function ClaimToSubmit() {
  const { serviceRequest, laborMarket } = useTypedLoaderData<typeof loader>();
  const mType = laborMarket.appData?.type;
  invariant(mType, "marketplace type must be specified");

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
        <p className="mt-2 text-gray-500 italic text-sm">
          Important: You must lock {laborMarket.configuration.reputationParams.provideStake} rMETRIC as defined by the
          Marketplace. If you don’t submit before the deadline, all{" "}
          {laborMarket.configuration.reputationParams.provideStake} of your locked rMETRIC will be slashed.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        <ConnectWalletWrapper onClick={handleClaimToSubmit}>
          <Button>
            <span> Claim to Submit</span>
          </Button>
        </ConnectWalletWrapper>
        <Button variant="cancel" asChild>
          <Link to={`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}`}>Cancel</Link>
        </Button>
      </div>
      <div className="invisible"></div>
      {state.context.contractData && (
        <Modal
          title="Claim to Submit"
          isOpen={isModalOpen && !state.matches("transactionWait")}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="space-y-8">
            <p className="mt-2">Please confirm that you would like to claim a submission.</p>
            <p>
              This will lock <b>{laborMarket.configuration.reputationParams.provideStake} rMETRIC.</b>
            </p>
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
