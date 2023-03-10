import { Card } from "~/components/card";
import type { ActivityDoc } from "~/domain";

export function ActivityCards({ activities }: { activities: ActivityDoc[] }) {
  return (
    <div className="space-y-4">
      {activities.map((a) => {
        return <ActivityCard activity={a} key={a.id} />;
      })}
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityDoc }) {
  return (
    <Card className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-2 py-5">
      <div>Action</div>
      <p>Action</p>
      <div>Title</div>
      <div>title</div>
      <div>status</div>
      status
      <div>Timestamp</div>
      <div className="text-black" color="dark.3">
        timestamp
      </div>
    </Card>
  );
}
