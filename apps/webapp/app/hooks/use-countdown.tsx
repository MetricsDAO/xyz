import { countDown } from "~/utils/date";
import { useUpdateInterval } from "~/hooks/use-update-interval";

export function useCountdown(date: Date) {
  useUpdateInterval(1000);

  return countDown(date);
}
