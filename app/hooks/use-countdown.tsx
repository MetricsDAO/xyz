import { countDown } from "~/utils/date";
import { useUpdateInterval } from "~/utils/use-update-interval";

export function useCountdown(date: Date | string) {
  useUpdateInterval(1000);

  return countDown(date);
}
