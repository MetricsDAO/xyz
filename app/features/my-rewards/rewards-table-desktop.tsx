import type { Token, Wallet } from "@prisma/client";
import { useSearchParams } from "@remix-run/react";
import { RewardBadge } from "~/components/reward-badge";
import { Header, Row, Table } from "~/components/table";
import type { CombinedDoc } from "~/domain/submission";
import { useGetReward } from "~/hooks/use-get-reward";
import { useHasPerformed } from "~/hooks/use-has-performed";
import { fromNow } from "~/utils/date";
import { fromTokenAmount } from "~/utils/helpers";
import { ClaimButton } from "./claim-button";

export function RewardsTable({
  rewards,
  wallets,
  tokens,
}: {
  rewards: CombinedDoc[];
  wallets: Wallet[];
  tokens: Token[];
}) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={3}>Challenge Title</Header.Column>
        <Header.Column span={3}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={3}>Rewarded</Header.Column>
        <Header.Column>Status</Header.Column>
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

function RewardsTableRow({ reward, wallets, tokens }: { reward: CombinedDoc; wallets: Wallet[]; tokens: Token[] }) {
  const contractReward = useGetReward({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    submissionId: reward.id,
  });
  const hasClaimed = useHasPerformed({
    laborMarketAddress: reward.laborMarketAddress as `0x${string}`,
    id: reward.id,
    action: "HAS_CLAIMED",
  });
  const [searchParams] = useSearchParams();
  const claimFilter = searchParams.get("claim");
  if (
    claimFilter &&
    !(claimFilter.includes("unclaimed") && !hasClaimed) &&
    !(claimFilter.includes("collected") && hasClaimed)
  ) {
    return <></>;
  }
  const token = tokens.find((t) => t.contractAddress === reward.sr.configuration.pToken);
  const showReward = contractReward !== undefined && hasClaimed === false;
  const showRewarded = contractReward !== undefined && hasClaimed === true;

  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <p>{reward.sr.appData?.title}</p>
      </Row.Column>
      <Row.Column span={3}>
        {showReward ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(reward.createdAtBlockTimestamp)}{" "}
      </Row.Column>
      <Row.Column span={3} className="text-black" color="dark.3">
        {showRewarded ? (
          <RewardBadge
            amount={fromTokenAmount(contractReward[0].toString())}
            token={token?.symbol ?? "Unknown Token"}
            rMETRIC={contractReward[1].toNumber()}
          />
        ) : (
          <span>--</span>
        )}
      </Row.Column>
      <Row.Column>
        {hasClaimed === false ? (
          <ClaimButton reward={reward} wallets={wallets} tokens={tokens} />
        ) : hasClaimed === true ? (
          <span>Claimed</span>
        ) : (
          <></>
        )}
      </Row.Column>
    </Row>
  );
}
