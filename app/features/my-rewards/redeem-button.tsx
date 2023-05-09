import { erc20ABI, useAccount, useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import type { Reward } from "~/domain/reward/functions.server";
import { RedeemRewardCreator } from "../redeem-reward-creator/redeem-reward-creator";
import { NoPayoutAddressFoundModalButton } from "./no-payout-address-modal-button";

export function RedeemButton({ reward, disabled }: { reward: Reward; disabled: boolean }) {
  // Would be great to be able to wagmi's useBalance here... except it doesn't work.
  const { data: balance } = useBalance({ tokenAddress: reward.app.token?.contractAddress as EvmAddress });

  const hasEnoughIOU = balance?.gt(reward.chain.paymentTokenAmount) ?? false;

  if (!reward.app.wallet) {
    return <NoPayoutAddressFoundModalButton buttonText="Redeem" networkName={reward.app.token?.networkName} />;
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
      disabled={disabled || !hasEnoughIOU}
      iouTokenAddress={reward.app.token.contractAddress as EvmAddress}
      laborMarketAddress={reward.submission.laborMarketAddress}
      submissionId={reward.submission.id}
      amount={reward.chain.paymentTokenAmount}
      signature={reward.treasury.signature as `0x${string}`}
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
