import dayjs from "dayjs";
import { useUpdateInterval } from "~/utils/use-update-interval";

export function useCountdown(date: Date | string) {
  useUpdateInterval(1000);

  const duration = dayjs(date).diff(dayjs());
  if (dayjs(date).diff(dayjs(), "month") >= 1) {
    return dayjs(duration).format("M[m] d[d] h[h]");
  } else if (dayjs(date).diff(dayjs(), "days") >= 1) {
    return dayjs(duration).format("d[d] h[h] m[m]");
  }

  return dayjs(duration).format("h[h] m[m] s[s]");
}
