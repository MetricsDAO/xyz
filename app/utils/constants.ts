import type { EvmAddress } from "~/domain/address";

export const SCORE_COLOR = {
  Stellar: "bg-lime-100",
  Good: "bg-blue-200",
  Average: "bg-neutral-200",
  Bad: "bg-orange-200",
  Spam: "bg-rose-200",
};

export const SCORE_COLOR_SECONDARY = {
  Stellar: "bg-lime-500",
  Good: "bg-blue-400",
  Average: "bg-zinc-500",
  Bad: "bg-amber-500",
  Spam: "bg-rose-400",
};

export const HIDDEN_PRODUCTION_LABOR_MARKETS = ["0x694E7835c7F5CBCc35d6874C3705c4f7887A17C5"] as EvmAddress[];
