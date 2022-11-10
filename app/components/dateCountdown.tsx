import dayjs from "dayjs";
import { useUpdateInterval } from "~/utils/use-update-interval";

function Countdown({ date }: { date: Date | string }) {
  useUpdateInterval(1000);

  const duration = dayjs(date).diff(dayjs());
  if (dayjs(date).diff(dayjs(), "months") >= 1) {
    return <>{dayjs(duration).format("d'd 'h'h 'm'm")}</>;
  } else if (dayjs(date).diff(dayjs(), "days") >= 1) {
    return <>{dayjs(duration).format("d'd 'h'h 'm'm")}</>;
  }
  return <>{dayjs(duration).format("hh'h 'm'm 's's")}</>;
}

export { Countdown };
