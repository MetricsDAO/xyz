export function RewardBadge({ amount, token, rMETRIC }: { amount: number; token: string; rMETRIC: number }) {
  return (
    <div className="flex rounded-full bg-gray-200 items-center pr-1 h-8 w-fit ">
      <div className="flex rounded-full bg-gray-100 px-2 gap-x-1 items-center py-1  h-8 ">
        <p className="text-sm">
          {amount.toLocaleString()} {token}
        </p>
      </div>
      <p className="text-sm px-1 text-neutral-500">{rMETRIC.toLocaleString()} rMETRIC</p>
    </div>
  );
}
