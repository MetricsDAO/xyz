import { Link } from "@remix-run/react";
import { Card } from "~/components/card";
import { Header, Row, Table } from "~/components/table";
import { fromNow } from "~/utils/date";
import { RewardDisplay, Status } from "./column-data";
import type { SubmissionWithReward } from "~/domain/submission/schemas";

export function SubmissionRewardsListView({ submissions }: { submissions: SubmissionWithReward[] }) {
  if (submissions.length === 0) {
    return (
      <div className="flex">
        <p className="text-gray-500 mx-auto py-12">Participate in Challenges and start earning!</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <RewardsTable submissions={submissions} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <RewardsCards submissions={submissions} />
      </div>
    </>
  );
}

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
  const { laborMarketAddress, serviceRequestId } = submission;

  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <Link className="text-blue-600" to={`/app/market/${laborMarketAddress}/request/${serviceRequestId}`}>
          {submission.sr.appData.title}
        </Link>
      </Row.Column>
      <Row.Column span={5}>
        <RewardDisplay submission={submission} />
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(submission.blockTimestamp)}{" "}
      </Row.Column>
      <Row.Column span={2}>
        <Status submission={submission} />
      </Row.Column>
    </Row>
  );
}

function RewardsCards({ submissions }: { submissions: SubmissionWithReward[] }) {
  return (
    <div className="space-y-4">
      {submissions.map((s) => {
        return <RewardCard key={`${s.laborMarketAddress}_${s.id}`} submission={s} />;
      })}
    </div>
  );
}

function RewardCard({ submission }: { submission: SubmissionWithReward }) {
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Challenge Title</div>
      <Link
        className="text-blue-600"
        to={`/app/market/${submission.laborMarketAddress}/request/${submission.serviceRequestId}`}
      >
        {submission.sr.appData.title}
      </Link>
      <div>Reward</div>
      <div>
        <RewardDisplay submission={submission} />
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(submission.blockTimestamp)} </p>
      <div>Status</div>
      <Status submission={submission} />
    </Card>
  );
}
