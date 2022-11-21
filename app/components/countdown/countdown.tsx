import { useCountdown } from "~/hooks/use-countdown";

// Utility component to render a time diff in a human readable text.
export function Countdown({ date }: { date: Date | string }) {
  const timeDiff = useCountdown(date);
  return <>{timeDiff}</>;
}
