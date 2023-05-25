import { Link } from "@remix-run/react";
import { Header, Row, Table } from "~/components/table";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { fromNow } from "~/utils/date";
import { submissionCreatedDate } from "~/utils/helpers";
import { RewardDisplay, Status } from "./column-data";

export function RewardsTable({ submissions }: { submissions: SubmissionWithReward[] }) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={3}>Challenge Title</Header.Column>
        <Header.Column span={5}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={2}>Status</Header.Column>
      </Header>
      {submissions.map((s) => {
        const { id, serviceRequestId, laborMarketAddress } = s;
        return <RewardsTableRow key={`${id}${serviceRequestId}${laborMarketAddress}`} submission={s} />;
      })}
    </Table>
  );
}

function RewardsTableRow({ submission }: { submission: SubmissionWithReward }) {
  const { laborMarketAddress, id } = submission;

  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <Link className="text-blue-600" to={`/app/market/${laborMarketAddress}/submission/${id}`}>
          {submission.sr.appData.title}
        </Link>
      </Row.Column>
      <Row.Column span={5}>
        <RewardDisplay submission={submission} />
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(submissionCreatedDate(submission))}{" "}
      </Row.Column>
      <Row.Column span={2}>
        <Status submission={submission} />
      </Row.Column>
    </Row>
  );
}
