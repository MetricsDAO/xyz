import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { RedeemRewardCreator } from "../redeem-reward-creator/redeem-reward-creator";
import { NoPayoutAddressFoundModalButton } from "./no-payout-address-modal-button";

export function RedeemButton({ submission }: { submission: SubmissionWithReward }) {
  // Treasury service will be looking for this wallet to make the native token payout to
  if (!submission.serviceProviderReward.wallet) {
    return (
      <NoPayoutAddressFoundModalButton
        buttonText="Redeem"
        networkName={submission.serviceProviderReward.reward.token?.networkName}
      />
    );
  }

  return (
    <RedeemRewardCreator
      submission={submission}
      confirmationMessage={<></>} //TODO
    />
  );
}
