import clsx from "clsx";
import { SCORE_COLOR, SCORE_COLOR_SECONDARY } from "~/utils/helpers";

type Props = {
  score: number;
};

export function Score({ score }: Props) {
  const label = score > 80 ? "Great" : score > 70 ? "Good" : score > 60 ? "Average" : score > 20 ? "Bad" : "Spam";

  return (
    <div className={clsx(SCORE_COLOR_SECONDARY[label], "rounded-lg h-9 flex text-sm w-fit")}>
      <div className={clsx(SCORE_COLOR[label], "h-full rounded-lg flex items-center justify-center w-20")}>{label}</div>
      <div className="w-7 flex items-center justify-center text-white text-xs">{score}</div>
    </div>
  );
}
