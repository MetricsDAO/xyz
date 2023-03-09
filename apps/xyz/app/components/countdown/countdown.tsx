import { useCountdown } from "~/hooks/use-countdown";

// Utility component to render a time diff in a human readable text.
export function Countdown({ date }: { date: Date }) {
  const timeDiff = useCountdown(date);
  return <>{timeDiff}</>;
}
