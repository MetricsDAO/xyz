import type { ObjectId } from "mongodb";
import { Countdown } from "~/components";
import { ActivityAvatar } from "~/components/activity/activity-avatar";
import { Header, Row, Table } from "~/components/table";
import type { ActivityDoc } from "~/domain";

export type ActivityDocWithMongoId = ActivityDoc & { _id: ObjectId };

export function ActivityTable({ activities }: { activities: ActivityDocWithMongoId[] }) {
  return (
    <Table>
      <Header columns={12} className="text-xs text-gray-500 font-medium mb-2">
        <Header.Column span={3}>Action</Header.Column>
        <Header.Column span={3}>Title</Header.Column>
        <Header.Column span={3}>Status</Header.Column>
        <Header.Column span={3}>Timestamp</Header.Column>
      </Header>
      {activities.map((a) => {
        return <ActivityTableRow activity={a} key={a._id.toString()} />;
      })}
    </Table>
  );
}

function ActivityTableRow({ activity }: { activity: ActivityDoc }) {
  return (
    <Row columns={12}>
      <Row.Column span={3}>
        <ActivityAvatar eventType={activity.groupType.toString()} />
        <p>{}</p>
      </Row.Column>
      <Row.Column span={3}>{activity.laborMarketTitle}</Row.Column>
      <Row.Column span={3} className="text-black">
        Active
      </Row.Column>
      <Row.Column span={2} className="text-black" color="dark.3">
        <Countdown date={activity.createdAtBlockTimestamp} />
      </Row.Column>
      <Row.Column></Row.Column>
    </Row>
  );
}
