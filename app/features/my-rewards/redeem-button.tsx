import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { RedeemRewardCreator } from "../redeem-reward-creator/redeem-reward-creator";
import { NoPayoutAddressFoundModalButton } from "./no-payout-address-modal-button";
import { useUser } from "~/hooks/use-user";
import type { EvmAddress } from "~/domain/address";

export function RedeemButton({ submission }: { submission: SubmissionWithReward }) {
  const user = useUser();
  const { iouClientTransactionSuccess, iouHasRedeemed } = submission.serviceProviderReward.reward;

  if (iouHasRedeemed) {
    // "redeemed"
    return <p>Claimed</p>;
  }

  if (iouClientTransactionSuccess) {
    // waiting on treasury service
    return <p>Pending</p>;
  }

  // Treasury service will be looking for this wallet to make the native token payout to
  if (!submission.serviceProviderReward.wallet) {
    return (
      <NoPayoutAddressFoundModalButton
        buttonText="Claim"
        networkName={submission.serviceProviderReward.reward.token?.networkName}
      />
    );
  }

  return <RedeemRewardCreator submission={submission} userAddress={user?.address as EvmAddress} />;
}
