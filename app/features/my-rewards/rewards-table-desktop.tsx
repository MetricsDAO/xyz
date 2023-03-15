import type { Token, Wallet } from "@prisma/client";
import { RewardBadge } from "~/components/reward-badge";
import { Header, Row, Table } from "~/components/table";
import type { SubmissionWithServiceRequest } from "~/domain/submission/schemas";
import { useReward } from "~/hooks/use-reward";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { fromNow } from "~/utils/date";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimButton } from "./claim-button";
import { useMemo } from "react";

export function RewardsTable({
  rewards,
  wallets,
  tokens,
}: {
  rewards: SubmissionWithServiceRequest[];
  wallets: Wallet[];
  tokens: Token[];
}) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={4}>Challenge Title</Header.Column>
        <Header.Column span={4}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={2}>Status</Header.Column>
      </Header>
      {rewards.map((r) => {
        return (
          <RewardsTableRow
            key={`${r.id}${r.serviceRequestId}${r.laborMarketAddress}`}
            reward={r}
            wallets={wallets}
            tokens={tokens}
          />
        );
      })}
    </Table>
  );
}

function RewardsTableRow({
  reward,
  wallets,
  tokens,
}: {
  reward: SubmissionWithServiceRequest;
  wallets: Wallet[];
  tokens: Token[];
}) {
  const contractReward = useReward({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    submissionId: reward.id,
  });
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
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
    <Row columns={12}>
      <Row.Column span={4}>
        <p>{reward.sr.appData?.title}</p>
      </Row.Column>
      <Row.Column span={4}>
        {rewardBadge ? (
          <RewardBadge
            amount={rewardBadge.amount}
            token={rewardBadge.token?.symbol ?? "Unknown"}
            rMETRIC={rewardBadge.rMETRIC}
          />
        ) : (
          <span>--</span>
        )}
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(reward.createdAtBlockTimestamp)}{" "}
      </Row.Column>
      <Row.Column span={2}>
        {hasClaimed === false && rewardBadge ? (
          <ClaimButton rewardAmount={rewardBadge.amount} reward={reward} wallets={wallets} tokens={tokens} />
        ) : hasClaimed === true ? (
          <span>Claimed</span>
        ) : (
          <></>
        )}
      </Row.Column>
    </Row>
  );
}
