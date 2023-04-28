import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { CopyToClipboard } from "~/components";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import type { EvmAddress } from "~/domain/address";
import type { Reward } from "~/domain/reward/functions.server";
import { fromTokenAmount, truncateAddress } from "~/utils/helpers";
import { ClaimRewardCreator } from "../claim-reward-creator/claim-reward-creator";

export function ClaimButton({ reward, disabled }: { reward: Reward; disabled: boolean }) {
  if (!reward.app.wallet) {
    return <NoWalletAddressFoundModalButton networkName={reward.app.token?.networkName} />;
  }

  const displayPaymentAmount = fromTokenAmount(reward.chain.paymentTokenAmount, reward.app.token?.decimals ?? 18, 2);
  return (
    <ClaimRewardCreator
      disabled={disabled}
      laborMarketAddress={reward.submission.laborMarketAddress}
      submissionId={reward.submission.id}
      payoutAddress={reward.app.wallet.address as EvmAddress}
      confirmationMessage={
        <>
          <div className="space-y-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center">
                <img alt="" src="/img/trophy.svg" className="h-8 w-8" />
                <p className="text-yellow-700 text-2xl ml-2">{`${displayPaymentAmount} ${
                  reward.app.token?.symbol ?? ""
                }`}</p>
              </div>
              <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">
                  {reward.app.wallet.networkName}
                </p>
                <div className="flex items-center p-3">
                  <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                  <p className="text-sm text-gray-600">
                    <CopyToClipboard
                      displayContent={truncateAddress(reward.app.wallet.address)}
                      content={reward.app.wallet.address}
                      iconRight={<DocumentDuplicateIcon className="w-5 h-5" />}
                      hideTooltip={true}
                    />
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
