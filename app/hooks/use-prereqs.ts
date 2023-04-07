import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import { useReputationTokenBalance } from "./use-reputation-token-balance";
import { useContracts } from "./use-root-data";
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

type Prereq = {
  canLaunchChallenges: boolean;
  canReview: boolean;
  canSubmit: boolean;
};

export function usePrereqsMulticall({ laborMarkets }: { laborMarkets: LaborMarketWithIndexData[] }) {
  const { address } = useAccount();
  const contracts = useContracts();
  const reputationTokenBalance = useReputationTokenBalance();
  return useQuery({
    enabled: !!address && !!reputationTokenBalance,
    queryKey: ["usePrereqsMulticall", laborMarkets],
    queryFn: async () => {
      const maintainerBadges = (await multicall({
        contracts: laborMarkets.map((m) => {
          return {
            address: m.configuration.maintainerBadge.token,
            abi: contracts.ReputationToken.abi,
            functionName: "balanceOf",
            args: [address, BigNumber.from(m.configuration.maintainerBadge.tokenId)],
          };
        }),
      })) as BigNumber[];

      const delegateBadges = (await multicall({
        contracts: laborMarkets.map((m) => {
          return {
            address: m.configuration.delegateBadge.token,
            abi: contracts.ReputationToken.abi,
            functionName: "balanceOf",
            args: [address, BigNumber.from(m.configuration.delegateBadge.tokenId)],
          };
        }),
      })) as BigNumber[];

      return laborMarkets.reduce((accumulator, currentValue, index) => {
        const maintainerBadgeBalance = maintainerBadges[index];
        const delegateBadgeBalance = delegateBadges[index];
        accumulator[currentValue.address] = {
          canReview: maintainerBadgeBalance?.gt(0) ?? false,
          canLaunchChallenges: delegateBadgeBalance?.gt(0) ?? false,
          canSubmit:
            (reputationTokenBalance?.gte(currentValue.configuration.reputationParams.submitMin) &&
              reputationTokenBalance?.lte(currentValue.configuration.reputationParams.submitMax)) ??
            false,
        };
        return accumulator;
      }, {} as Record<EvmAddress, Prereq>);
    },
  });
}
