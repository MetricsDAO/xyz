type Props = {
  score: number;
};

export function Score({ score }: Props) {
  return (
    <div className="rounded-lg h-9 flex bg-gray-400 text-sm w-fit">
      <div className="h-full rounded-lg bg-gray-200 flex items-center justify-center w-20">
        {score > 80 ? "Great" : score > 70 ? "Good" : score > 60 ? "Average" : score > 20 ? "Bad" : "Spam"}
      </div>
      <div className="w-7 flex items-center justify-center text-white text-xs">{score}</div>
    </div>
  );
}
