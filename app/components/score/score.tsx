import clsx from "clsx";
import { SCORE_COLOR, SCORE_COLOR_SECONDARY } from "~/utils/constants";

type Props = {
  score: number;
};

export function Score({ score }: Props) {
  const label = scoreNumToLabel(score);

  return (
    <div className={clsx(SCORE_COLOR_SECONDARY[label], "rounded-lg h-9 flex text-sm w-fit")}>
      <div className={clsx(SCORE_COLOR[label], "h-full rounded-lg flex items-center justify-center w-20")}>{label}</div>
      <div className="w-7 flex items-center justify-center text-white text-xs">{score}</div>
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const label = scoreNumToLabel(score);
  return (
    <div className={clsx(SCORE_COLOR_SECONDARY[label], "flex rounded-full items-center pr-1 h-8 w-fit")}>
      <div className={clsx(SCORE_COLOR[label], "flex rounded-full px-2 gap-x-1 items-center py-1 h-8")}>
        <p className="text-sm text-black">{label}</p>
      </div>
      <p className="text-sm px-1 text-white">{score}</p>
    </div>
  );
}

export function scoreNumToLabel(score: number) {
  return score >= 90 ? "Great" : score >= 70 ? "Good" : score >= 45 ? "Average" : score >= 25 ? "Bad" : "Spam";
}
