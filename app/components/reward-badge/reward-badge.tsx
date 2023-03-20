import clsx from "clsx";
import { Tooltip } from "../tooltip";

type Variant = "default" | "winner";

export function RewardBadge({
  paymentTokenAmount,
  paymentTooltipAmount,
  reputationTokenAmount,
  tokenSymbol,
  variant = "default",
}: {
  paymentTokenAmount: string;
  paymentTooltipAmount?: string;
  reputationTokenAmount: string;
  tokenSymbol: string;
  variant?: Variant;
}) {
  return (
    <div
      className={clsx("flex rounded-full items-center pr-1 h-8 w-fit", {
        "bg-gray-200": variant === "default",
        "bg-yellow-600": variant === "winner",
      })}
    >
      <div
        className={clsx("flex rounded-full px-2 gap-x-1 items-center py-1 h-8", {
          "bg-gray-100": variant === "default",
          "bg-yellow-200": variant === "winner",
        })}
      >
        <p
          className={clsx("text-sm", { "text-black": variant === "default", "text-yellow-700": variant === "winner" })}
        >
          <Tooltip hide={paymentTooltipAmount === undefined} content={paymentTooltipAmount}>
            {variant === "winner" ? <b>🏆</b> : <></>} {paymentTokenAmount} {tokenSymbol}
          </Tooltip>
        </p>
      </div>
      <p
        className={clsx("text-sm px-1", {
          "text-neutral-500": variant === "default",
          "text-white": variant === "winner",
        })}
      >
        {reputationTokenAmount} rMETRIC
      </p>
    </div>
  );
}
