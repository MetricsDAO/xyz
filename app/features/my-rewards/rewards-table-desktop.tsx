import { Link } from "@remix-run/react";
import { Header, Row, Table } from "~/components/table";
import type { Reward } from "~/domain/reward/functions.server";
import { fromNow } from "~/utils/date";
import { submissionCreatedDate } from "~/utils/helpers";
import { RewardDisplay, Status } from "./column-data";

export function RewardsTable({ rewards }: { rewards: Reward[] }) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={4}>Challenge Title</Header.Column>
        <Header.Column span={4}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={2}>Status</Header.Column>
      </Header>
      {rewards.map((r) => {
        const { id, serviceRequestId, laborMarketAddress } = r.submission;
        return <RewardsTableRow key={`${id}${serviceRequestId}${laborMarketAddress}`} reward={r} />;
      })}
    </Table>
  );
}

function RewardsTableRow({ reward }: { reward: Reward }) {
  const { laborMarketAddress, id } = reward.submission;

  return (
    <Row columns={12}>
      <Row.Column span={4}>
        <Link className="text-blue-600" to={`/app/market/${laborMarketAddress}/submission/${id}`}>
          {reward.submission.sr.appData.title}
        </Link>
      </Row.Column>
      <Row.Column span={4}>
        <RewardDisplay reward={reward} />
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(submissionCreatedDate(reward.submission))}{" "}
      </Row.Column>
      <Row.Column span={2}>
        <Status reward={reward} />
      </Row.Column>
    </Row>
  );
}
