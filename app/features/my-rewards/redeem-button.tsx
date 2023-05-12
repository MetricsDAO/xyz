import { erc20ABI, useAccount, useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { RedeemRewardCreator } from "../redeem-reward-creator/redeem-reward-creator";
import { NoPayoutAddressFoundModalButton } from "./no-payout-address-modal-button";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";

export function RedeemButton({ submission }: { submission: SubmissionWithReward }) {
  const { token, paymentTokenAmount, iouSignature, hasClaimed, iouHasRedeemed } =
    submission.serviceProviderReward.reward;

  // Would be great to be able to wagmi's useBalance here... except it doesn't work.
  const { data: balance } = useBalance({ tokenAddress: token?.contractAddress as EvmAddress });

  const hasEnoughIOU = balance?.gt(paymentTokenAmount) ?? false;

  if (!submission.serviceProviderReward.wallet) {
    return <NoPayoutAddressFoundModalButton buttonText="Redeem" networkName={token?.networkName} />;
  }

  // TODO this error handling?
  if (!iouSignature) {
    return <p>Missing signature</p>;
  }

  if (!token) {
    return <p>Missing token</p>;
  }

  return (
    <RedeemRewardCreator
      disabled={!hasClaimed || iouHasRedeemed === true || !hasEnoughIOU}
      iouTokenAddress={token.contractAddress as EvmAddress}
      laborMarketAddress={submission.laborMarketAddress}
      submissionId={submission.id}
      amount={paymentTokenAmount}
      signature={iouSignature as `0x${string}`}
      confirmationMessage={<></>} //TODO
    />
  );
}

function useBalance({ tokenAddress }: { tokenAddress: EvmAddress }) {
  const account = useAccount();
  return useContractRead({
    enabled: !!account.address,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [account.address as EvmAddress],
  });
}
