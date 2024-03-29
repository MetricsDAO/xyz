import { Link } from "@remix-run/react";
import { Card } from "~/components/card";
import { Header, Row, Table } from "~/components/table";
import { fromNow } from "~/utils/date";
import { RewardDisplay, Status } from "./column-data";
import type { ReviewWithSubmission } from "~/domain";

export function ReviewsRewardsListView({ reviews }: { reviews: ReviewWithSubmission[] }) {
  if (reviews.length === 0) {
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
        <RewardsTable reviews={reviews} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <RewardsCards reviews={reviews} />
      </div>
    </>
  );
}

export function RewardsTable({ reviews }: { reviews: ReviewWithSubmission[] }) {
  return (
    <Table>
      <Header columns={12} className="mb-2">
        <Header.Column span={3}>Submission Title</Header.Column>
        <Header.Column span={5}>Reward</Header.Column>
        <Header.Column span={2}>Submitted</Header.Column>
        <Header.Column span={2}>Status</Header.Column>
      </Header>
      {reviews.map((r) => {
        const { serviceRequestId, laborMarketAddress, submissionId, id } = r;
        return <RewardsTableRow key={`${laborMarketAddress}${serviceRequestId}${submissionId}${id}`} review={r} />;
      })}
    </Table>
  );
}

function RewardsTableRow({ review }: { review: ReviewWithSubmission }) {
  const { laborMarketAddress, serviceRequestId } = review;

  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <Link className="text-blue-600" to={`/app/market/${laborMarketAddress}/request/${serviceRequestId}`}>
          {review.s.appData?.title}
        </Link>
      </Row.Column>
      <Row.Column span={5}>
        <RewardDisplay review={review} />
      </Row.Column>
      <Row.Column span={2} className="text-black">
        {fromNow(review.blockTimestamp)}{" "}
      </Row.Column>
      <Row.Column span={2}>
        <Status review={review} />
      </Row.Column>
    </Row>
  );
}

function RewardsCards({ reviews }: { reviews: ReviewWithSubmission[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((r) => {
        const { serviceRequestId, laborMarketAddress, submissionId, id } = r;
        return <RewardCard key={`${laborMarketAddress}${serviceRequestId}${submissionId}${id}`} review={r} />;
      })}
    </div>
  );
}

function RewardCard({ review }: { review: ReviewWithSubmission }) {
  const { laborMarketAddress, serviceRequestId } = review;
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Submission Title</div>
      <Link className="text-blue-600" to={`/app/market/${laborMarketAddress}/request/${serviceRequestId}`}>
        {review.s.appData?.title}
      </Link>
      <div>Reward</div>
      <div>
        <RewardDisplay review={review} />
      </div>
      <div>Submitted</div>
      <p className="text-black">{fromNow(review.blockTimestamp)} </p>
      <div>Status</div>
      <Status review={review} />
    </Card>
  );
}
