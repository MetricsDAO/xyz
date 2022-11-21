export function RewardBadge({ tokenAmount, token, rMetric }: { tokenAmount: number; token: string; rMetric: number }) {
  return (
    <div className="flex rounded-full bg-[#ADB5BD] items-center pr-1">
      <div className="flex rounded-full bg-[#F1F3F5] px-2 items-center uppercase py-1">
        <p className="text-sm">
          {tokenAmount} {token}
        </p>
      </div>
      <p className="text-xs px-1">{rMetric} rMETRIC</p>
    </div>
  );
}
