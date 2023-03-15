import { CheckCircleIcon } from "@heroicons/react/20/solid";
import type { Token, Wallet } from "@prisma/client";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import type { SubmissionWithServiceRequest } from "~/domain/submission";
import { toNetworkName, toTokenAbbreviation, truncateAddress } from "~/utils/helpers";
import { ClaimRewardCreator } from "../claim-reward-creator/claim-reward-creator";

export function ClaimButton({
  submission,
  wallets,
  tokens,
  rewardAmount,
}: {
  submission: SubmissionWithServiceRequest;
  wallets: Wallet[];
  tokens: Token[];
  rewardAmount: string;
}) {
  const tokenAbrev = toTokenAbbreviation(submission.sr.configuration.pToken ?? "", tokens);
  const networkName = toNetworkName(submission.sr.configuration.pToken ?? "", tokens);
  const wallet = wallets.find((w) => w.networkName === networkName);

  if (!wallet) {
    return <NoWalletAddressFoundModalButton networkName={networkName} />;
  }

  return (
    <ClaimRewardCreator
      laborMarketAddress={submission.laborMarketAddress}
      submissionId={submission.id}
      payoutAddress={wallet.address}
      confirmationMessage={
        <>
          <div className="space-y-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center">
                <img alt="trophy" src="/img/trophy.svg" className="h-8 w-8" />
                <p className="text-yellow-700 text-2xl ml-2">{`${rewardAmount} ${tokenAbrev}`}</p>
              </div>
              <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">
                  {networkName}
                </p>
                <div className="flex items-center p-3">
                  <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                  <p className="text-sm text-gray-600">{truncateAddress(wallet.address)}</p>
                </div>
              </div>
              <p className="text-xs">
                To change or update this address head to{" "}
                <Link to="/app/rewards/addresses" className="text-blue-600">
                  Payout Addresses
                </Link>
              </p>
            </div>
          </div>
        </>
      }
    />
  );
}

function NoWalletAddressFoundModalButton({ networkName }: { networkName?: string }) {
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setConfirmedModalOpen(true)}>Claim</Button>
      <Modal isOpen={confirmedModalOpen} onClose={() => setConfirmedModalOpen(false)} title="Claim your reward!">
        <p className="my-5">
          No address found for <b>{networkName ?? "Unknown Network"}</b>. To add an address head to{" "}
          <Link to="/app/rewards/addresses" className="text-blue-600">
            Payout Addresses
          </Link>
        </p>
      </Modal>
    </>
  );
}
