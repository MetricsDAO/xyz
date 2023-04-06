import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import { useReputationTokenBalance } from "./use-reputation-token-balance";
import { useTokenBalance } from "./use-token-balance";

// Determines which actions a user can perform by looking at token balances.
export function usePrereqs({ laborMarket }: { laborMarket: LaborMarketWithIndexData }) {
  const maintainerBadgeTokenBalance = useTokenBalance({
    tokenAddress: laborMarket.configuration.maintainerBadge.token,
    tokenId: laborMarket.configuration.maintainerBadge.tokenId,
  });

  const delegateBadgeTokenBalance = useTokenBalance({
    tokenAddress: laborMarket.configuration.delegateBadge.token,
    tokenId: laborMarket.configuration.delegateBadge.tokenId,
  });

  const reputationBalance = useReputationTokenBalance();

  const canLaunchChallenges = delegateBadgeTokenBalance?.gt(0);
  const canReview = maintainerBadgeTokenBalance?.gt(0);
  const canSubmit =
    reputationBalance?.gte(laborMarket.configuration.reputationParams.submitMin) &&
    reputationBalance?.lte(laborMarket.configuration.reputationParams.submitMax);

  return {
    canLaunchChallenges,
    canReview,
    canSubmit,
  };
}
