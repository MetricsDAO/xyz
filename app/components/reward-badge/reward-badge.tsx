import type { Token } from "@prisma/client";
import clsx from "clsx";
import { TokenAvatar } from "../avatar";
import { Tooltip } from "../tooltip";

type Variant = "default" | "winner";

type Props = {
  variant?: Variant;
  payment: {
    amount: string;
    token?: Token;
    tooltipAmount?: string;
  };
  reputation?: {
    amount: string;
  };
};

export function RewardBadge({ payment, reputation, variant = "default" }: Props) {
  return (
    <div
      className={clsx("flex rounded-full items-center h-8 w-fit", {
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
          <Tooltip hide={payment.tooltipAmount === undefined} content={payment.tooltipAmount}>
            <span className="inline-flex items-center justify-center h-8 whitespace-nowrap">
              {variant === "winner" ? <b>🏆</b> : <>{payment.token && <TokenAvatar token={payment.token} />}</>}
              <span className="mx-1">
                {payment.amount} {payment.token?.symbol ?? ""}
              </span>
            </span>
          </Tooltip>
        </p>
      </div>
      {reputation && (
        <p
          className={clsx("text-sm pl-1 pr-2", {
            "text-neutral-500": variant === "default",
            "text-white": variant === "winner",
          })}
        >
          {reputation.amount} rMETRIC
        </p>
      )}
    </div>
  );
}
