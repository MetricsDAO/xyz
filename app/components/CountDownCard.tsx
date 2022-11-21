import { CountDown } from "./CountDown";
import { Progress } from "./Progress";

export function CountDownCard({
  progress,
  time,
  children,
}: {
  progress: number;
  time: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="ring-1 ring-black/5 ring-inset rounded-lg shadow shadow-black/10 overflow-hidden">
      <Progress progress={10} />
      <main className="flex flex-col items-center justify-center py-12 space-y-2">
        <div className="sr-only">Progess bar with {100 - progress} percent left</div>
        <span className="text-4xl">
          <CountDown date={time} />
        </span>
        {children ? <div className="text-lg text-gray-500">{children}</div> : null}
      </main>
    </div>
  );
}
