import { Countdown } from "~/components";
import { ActivityAvatar } from "~/components/activity/activity-avatar";
import { Card } from "~/components/card";
import type { ActivityDoc } from "~/domain";
import type { ActivityDocWithMongoId } from "./activity-table-desktop";

export function ActivityCards({ activities }: { activities: ActivityDocWithMongoId[] }) {
  return (
    <div className="space-y-4">
      {activities.map((a) => {
        return <ActivityCard activity={a} key={a._id.toString()} />;
      })}
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityDoc }) {
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Action</div>
      <ActivityAvatar iconType={activity.iconType.toString()} />
      <div>Title</div>
      <div>{activity.eventType.config.laborMarketTitle}</div>
      <div>Timestamp</div>
      <Countdown date={activity.createdAtBlockTimestamp} />
    </Card>
  );
}
