import type { LaborMarketDoc } from "~/domain/labor-market/schemas";
import { useIsAuthorized } from "./use-is-authorized";

// Determines which actions a user can perform
export function usePrereqs({ laborMarket }: { laborMarket: LaborMarketDoc }) {
  const { data: canLaunchChallege } = useIsAuthorized(laborMarket.address, "submitRequest");
  const { data: canReview } = useIsAuthorized(laborMarket.address, "signalReview");
  const { data: canSubmit } = useIsAuthorized(laborMarket.address, "signal");

  return {
    canLaunchChallenges: canLaunchChallege,
    canReview: canReview,
    canSubmit: canSubmit,
  };
}
