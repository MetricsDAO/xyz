import { Progress } from "~/components/progress/progress";
import { useCountdown } from "~/hooks/use-countdown";
import { progressTime } from "~/utils/date";

type CountdownCardProps = {
  start: Date;
  end: Date;
  children?: React.ReactNode;
};

export function CountdownCard({ start, end, children }: CountdownCardProps) {
  const count = useCountdown(end);
  const progress = progressTime(start, end);
  return (
    <div className="ring-1 ring-black/5 ring-inset rounded-lg shadow shadow-black/10 overflow-hidden">
      <Progress progress={progress} />
      <main className="flex flex-col items-center justify-center py-12 space-y-2">
        <div className="sr-only">Progess bar with {100 - progress} percent left</div>
        <span className="text-4xl">{count}</span>
        {children ? <div className="text-lg text-gray-500">{children}</div> : null}
      </main>
    </div>
  );
}
