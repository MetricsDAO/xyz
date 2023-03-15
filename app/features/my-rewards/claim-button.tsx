import { CheckCircleIcon } from "@heroicons/react/20/solid";
import type { Token, Wallet } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { SendTransactionResult } from "@wagmi/core";
import { useMachine } from "@xstate/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import type { SubmissionWithServiceRequest } from "~/domain/submission";
import { RPCError } from "~/features/rpc-error";
import { ClaimRewardWeb3Button } from "~/features/web3-button/claim-reward";
import type { EthersError } from "~/features/web3-button/types";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import type { ClaimRewardContractData } from "~/hooks/use-claim-reward";
import { toNetworkName, toTokenAbbreviation } from "~/utils/helpers";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";

const machine = createBlockchainTransactionStateMachine<ClaimRewardContractData>();
export function ClaimButton({
  reward,
  wallets,
  tokens,
  rewardAmount,
}: {
  reward: SubmissionWithServiceRequest;
  wallets: Wallet[];
  tokens: Token[];
  rewardAmount: string;
}) {
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const tokenAbrev = toTokenAbbreviation(reward.sr.configuration.pToken ?? "", tokens);
  const networkName = toNetworkName(reward.sr.configuration.pToken ?? "", tokens);
  const wallet = wallets.find((w) => w.networkName === networkName);

  const [state, send] = useMachine(
    machine.withContext({
      contractData: {
        laborMarketAddress: reward.laborMarketAddress,
        payoutAddress: wallet?.address ?? "",
        submissionId: reward.id,
      },
    }),
    {
      actions: {
        ...defaultNotifyTransactionActions,
      },
    }
  );
  invariant(state.context.contractData, "Contract data should be defined");

  const onWriteSuccess = (result: SendTransactionResult) => {
    transitionModal();
    send({ type: "SUBMIT_TRANSACTION", transactionHash: result.hash, transactionPromise: result.wait(1) });
  };

  function transitionModal() {
    closeConfirmedModal();
    openSuccessModal();
  }

  function openConfirmedModal() {
    setConfirmedModalOpen(true);
  }

  function closeConfirmedModal() {
    setConfirmedModalOpen(false);
  }

  function openSuccessModal() {
    setSuccessModalOpen(true);
  }

  function closeSuccessModal() {
    setSuccessModalOpen(false);
  }

  const [error, setError] = useState<EthersError>();
  const onPrepareTransactionError = (error: EthersError) => {
    setError(error);
  };

  return (
    <>
      <Button onClick={openConfirmedModal}>Claim</Button>
      <Modal isOpen={confirmedModalOpen} onClose={closeConfirmedModal} title="Claim your reward!">
        {wallet ? (
          <div className="space-y-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center">
                <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
                <p className="text-yellow-700 text-2xl ml-2">{`${rewardAmount} ${tokenAbrev}`}</p>
              </div>
              <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">
                  {networkName}
                </p>
                <div className="flex items-center p-3">
                  <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    {wallet?.address && wallet?.address.length < 30
                      ? wallet?.address
                      : `${wallet?.address.slice(0, 16)}...${wallet?.address.slice(-14)}`}
                  </p>
                </div>
              </div>
              <p className="text-xs">
                To change or update this address head to{" "}
                <Link to="/app/rewards/addresses" className="text-blue-600">
                  Payout Addresses
                </Link>
              </p>
            </div>
            {error && <RPCError error={error} />}
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={closeConfirmedModal}>
                Cancel
              </Button>
              {!error && (
                <ClaimRewardWeb3Button
                  data={state.context.contractData}
                  onWriteSuccess={onWriteSuccess}
                  onPrepareTransactionError={onPrepareTransactionError}
                />
              )}
            </div>
          </div>
        ) : (
          <p className="my-5">
            No address found for <b>{networkName}</b>. To add an address head to{" "}
            <Link to="/app/rewards/addresses" className="text-blue-600">
              Payout Addresses
            </Link>
          </p>
        )}
      </Modal>
      <Modal isOpen={successModalOpen} onClose={closeSuccessModal}>
        <div className="mx-auto space-y-7">
          <img src="/img/check-circle.svg" alt="" className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-center text-2xl font-semibold">Claim proccessing</h1>
            <p className="text-gray-500 text-center text-md">
              {"This transaction could take up to {x amount of time}. Please check back in a bit."}
            </p>
            <p className="text-gray-500 text-center text-sm">{"If there are any issues please reach out on Discord"}</p>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="cancel" fullWidth onClick={closeSuccessModal}>
              Cancel
            </Button>
            <Button fullWidth onClick={closeSuccessModal}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
