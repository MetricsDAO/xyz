import { toDateTime } from "~/utils/helpers";
import { useUpdateInterval } from "~/utils/use-update-interval";

function Countdown({ date }: { date: Date | string }) {
  useUpdateInterval(1000);

  const target = toDateTime(date);
  const duration = target.diffNow();
  if (duration.as("days") >= 1) {
    return <>{duration.toFormat("d'd 'h'h 'm'm")}</>;
  }
  return <>{duration.toFormat("hh'h 'm'm 's's")}</>;
}

export { Countdown };
