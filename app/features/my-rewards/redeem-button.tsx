import { Link } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import type { EvmAddress } from "~/domain/address";
import type { Reward } from "~/domain/reward/functions.server";
import { RedeemRewardCreator } from "../redeem-reward-creator/redeem-reward-creator";

export function RedeemButton({ reward }: { reward: Reward }) {
  if (!reward.app.wallet) {
    return <NoWalletAddressFoundModalButton networkName={reward.app.token?.networkName} />;
  }

  // TODO this error handling?
  if (!reward.treasury?.signature) {
    return <p>Missing signature</p>;
  }

  if (!reward.app.token) {
    return <p>Missing token</p>;
  }

  return (
    <RedeemRewardCreator
      iouTokenAddress={reward.app.token.contractAddress as EvmAddress}
      laborMarketAddress={reward.submission.laborMarketAddress}
      submissionId={reward.submission.id}
      amount={reward.chain.paymentTokenAmount}
      signature={reward.treasury.signature as `0x${string}`}
      confirmationMessage={<></>} //TODO
    />
  );
}

function NoWalletAddressFoundModalButton({ networkName }: { networkName?: string }) {
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setConfirmedModalOpen(true)}>Redeem</Button>
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
