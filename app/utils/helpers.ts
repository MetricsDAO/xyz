import { DateTime } from "luxon";

export const PROJECT_ICONS: Record<string, string | undefined> = {
  Ethereum: "/img/icons/project-icons/eth.svg",
  Solana: "/img/icons/project-icons/sol.svg",
};

export function toDateTime(date: Date | string) {
  let target: DateTime;
  if (typeof date === "string") {
    target = DateTime.fromISO(date);
  } else {
    target = DateTime.fromJSDate(date);
  }

  return target;
}
