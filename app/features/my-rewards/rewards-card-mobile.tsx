import type { Token, Wallet } from "@prisma/client";
import { Card } from "~/components/card";
import { RewardBadge } from "~/components/reward-badge";
import type { SubmissionWithServiceRequest } from "~/domain/submission";
import { useReward } from "~/hooks/use-reward";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { fromNow } from "~/utils/date";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimButton } from "./claim-button";
import { useMemo } from "react";

export function RewardsCards({
  rewards,
  wallets,
  tokens,
}: {
  rewards: SubmissionWithServiceRequest[];
  wallets: Wallet[];
  tokens: Token[];
}) {
  return (
    <div className="space-y-4">
      {rewards.map((r) => {
        return <RewardCard key={`${r.laborMarketAddress}_${r.id}`} reward={r} wallets={wallets} tokens={tokens} />;
      })}
    </div>
  );
}

function RewardCard({
  reward,
  wallets,
  tokens,
}: {
  reward: SubmissionWithServiceRequest;
  wallets: Wallet[];
  tokens: Token[];
}) {
  const contractReward = useReward({
    laborMarketAddress: reward.laborMarketAddress as EvmAddress,
    submissionId: reward.id,
  });
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.laborMarketAddress as EvmAddress,
    id: reward.id,
    action: "HAS_CLAIMED",
  });

  const rewardBadge = useMemo(() => {
    if (contractReward === undefined) {
      return undefined;
    }
    const token = tokens.find((t) => t.contractAddress === reward.sr.configuration.pToken);
    return {
      amount: fromTokenAmount(contractReward.paymentTokenAmount.toString(), 3),
      rMETRIC: contractReward.reputationTokenAmount.toNumber(),
      token: token,
    };
  }, [contractReward, tokens, reward.sr.configuration.pToken]);

  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <p>{reward.sr.appData?.title}</p>
      <div>Reward</div>
      <div>
        {rewardBadge ? (
          <RewardBadge
            amount={rewardBadge.amount}
            token={rewardBadge.token?.symbol ?? "Unknown"}
            rMETRIC={rewardBadge.rMETRIC}
          />
        ) : (
          <span>--</span>
        )}
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(reward.createdAtBlockTimestamp)} </p>
      <div>Status</div>
      {hasClaimed === false && rewardBadge ? (
        <ClaimButton rewardAmount={rewardBadge.amount} reward={reward} wallets={wallets} tokens={tokens} />
      ) : hasClaimed === true ? (
        <span>Claimed</span>
      ) : (
        <></>
      )}
    </Card>
  );
}
