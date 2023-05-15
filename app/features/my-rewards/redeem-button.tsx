import { erc20ABI, useAccount, useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { RedeemRewardCreator } from "../redeem-reward-creator/redeem-reward-creator";
import { NoPayoutAddressFoundModalButton } from "./no-payout-address-modal-button";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";

export function RedeemButton({ submission }: { submission: SubmissionWithReward }) {
  const { token, paymentTokenAmount, iouSignature, hasClaimed, iouHasRedeemed, iouClientTransactionSuccess } =
    submission.serviceProviderReward.reward;

  // Would be great to be able to wagmi's useBalance here... except it doesn't work.
  const { data: balance } = useBalance({ tokenAddress: token?.contractAddress as EvmAddress });

  if (!submission.serviceProviderReward.wallet) {
    return <NoPayoutAddressFoundModalButton buttonText="Redeem" networkName={token?.networkName} />;
  }

  const hasEnoughIOU = balance?.gt(paymentTokenAmount) ?? false;

  if (!iouSignature) {
    return <p>Missing signature</p>;
  }

  if (!token) {
    return <p>Missing token</p>;
  }

  return (
    <RedeemRewardCreator
      disabled={!hasClaimed || iouHasRedeemed === true || iouClientTransactionSuccess || !hasEnoughIOU}
      iouTokenAddress={token.contractAddress as EvmAddress}
      iouSignature={iouSignature as `0x${string}`}
      submission={submission}
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
