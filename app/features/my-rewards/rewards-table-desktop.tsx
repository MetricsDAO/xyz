import type { Wallet } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Header, Row, Table } from "~/components/table";
import type { SubmissionWithServiceRequest } from "~/domain/submission/schemas";
import { useReward } from "~/hooks/use-reward";
import { useTokens } from "~/hooks/use-root-data";
import { fromNow } from "~/utils/date";
import { Reward, Status } from "./column-data";

export function RewardsTable({ rewards, wallets }: { rewards: SubmissionWithServiceRequest[]; wallets: Wallet[] }) {
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
          <RewardsTableRow key={`${r.id}${r.serviceRequestId}${r.laborMarketAddress}`} reward={r} wallets={wallets} />
        );
      })}
    </Table>
  );
}

function RewardsTableRow({ reward, wallets }: { reward: SubmissionWithServiceRequest; wallets: Wallet[] }) {
  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === reward.sr.configuration.pToken);
  const { data: contractReward } = useReward({
    laborMarketAddress: reward.laborMarketAddress,
    submissionId: reward.id,
    tokenDecimals: token?.decimals ?? 18,
  });

  return (
    <Row columns={12}>
      <Row.Column span={4}>
        <Link className="text-blue-600" to={`/app/market/${reward.laborMarketAddress}/submission/${reward.id}`}>
          {reward.sr.appData.title}
        </Link>
      </Row.Column>
      <Row.Column span={4}>
        <Reward reward={contractReward} token={token} />
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(reward.createdAtBlockTimestamp)}{" "}
      </Row.Column>
      <Row.Column span={2}>
        <Status reward={contractReward} submission={reward} wallets={wallets} />
      </Row.Column>
    </Row>
  );
}
