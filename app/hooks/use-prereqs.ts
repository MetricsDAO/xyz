import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import type { LaborMarket as LaborMarketType, LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import { useReputationTokenBalance } from "./use-reputation-token-balance";
import { useContracts } from "./use-root-data";

// Determines which actions a user can perform by looking at token balances.
export function usePrereqs({ laborMarket }: { laborMarket: LaborMarketType }) {
  const { address: userAddress } = useAccount();

  const contracts = useContracts();

  const iface = LaborMarket__factory.createInterface();

  const { data: canLaunchChallege } = useContractRead({
    enabled: !!userAddress,
    address: laborMarket.address,
    abi: contracts.LaborMarket.abi,
    functionName: "isAuthorized",
    args: [
      // @ts-ignore "enabled" ensures userAddress is defined
      userAddress,
      iface.getSighash(
        iface.functions[
          "submitRequest(uint8,(uint48,uint48,uint48,uint64,uint64,uint256,uint256,address,address),string)"
        ]
      ) as `0x${string}`,
    ],
  });

  const { data: canReview } = useContractRead({
    enabled: !!userAddress,
    address: laborMarket.address,
    abi: contracts.LaborMarket.abi,
    functionName: "isAuthorized",
    args: [
      // @ts-ignore "enabled" ensures userAddress is defined
      userAddress,
      iface.getSighash(iface.functions["signalReview(uint256,uint24)"]) as `0x${string}`,
    ],
  });

  const { data: canSubmit } = useContractRead({
    enabled: !!userAddress,
    address: laborMarket.address,
    abi: contracts.LaborMarket.abi,
    functionName: "isAuthorized",
    args: [
      // @ts-ignore "enabled" ensures userAddress is defined
      userAddress,
      iface.getSighash(iface.functions["signal(uint256)"]) as `0x${string}`,
    ],
  });

  return {
    canLaunchChallenges: canLaunchChallege ?? false,
    canReview: canReview ?? false,
    canSubmit: canSubmit ?? false,
  };
}

type Prereq = {
  canLaunchChallenges: boolean;
  // canReview: boolean;
  // canSubmit: boolean;
};

/**
 * lookup all the prereqs for list of labormarkets.
 * @param laborMarkets
 * @returns a React query where the data type is a map of labormarket address to prereqs.
 */
export function usePrereqsMulticall({ laborMarkets }: { laborMarkets: LaborMarketWithIndexData[] }) {
  const { address } = useAccount();
  const reputationTokenBalance = useReputationTokenBalance();
  return useQuery({
    enabled: !!address && !!reputationTokenBalance,
    queryKey: ["usePrereqsMulticall", laborMarkets],
    queryFn: async () =>
      // because of "enabled" address and reputationTokenBalance should be defined here. Use "!" to tell typescript that.
      prereqs(laborMarkets, address!, reputationTokenBalance!),
  });
}

/**
 * Use multicall to fetch all the badges for a user and transform them into a Record lookup where the key is labormarket address and the value is the prereqs.
 * @param contracts
 * @param laborMarkets
 * @param userAddress
 * @param userReputationTokenBalance
 * @returns Promise<Record<EvmAddress, Prereq>>
 */
async function prereqs(
  laborMarkets: LaborMarketWithIndexData[],
  userAddress: EvmAddress,
  userReputationTokenBalance: BigNumber
): Promise<Record<EvmAddress, Prereq>> {
  const maintainerBadges = (await multicall({
    contracts: laborMarkets.map((m) => {
      return {
        address: m.configuration.maintainerBadge.token,
        abi: TOKEN_BALANCEOF_ABI,
        functionName: "balanceOf",
        args: [userAddress, BigNumber.from(m.configuration.maintainerBadge.tokenId)],
      };
    }),
  })) as BigNumber[];

  const delegateBadges = (await multicall({
    contracts: laborMarkets.map((m) => {
      return {
        address: m.configuration.delegateBadge.token,
        abi: TOKEN_BALANCEOF_ABI,
        functionName: "balanceOf",
        args: [userAddress, BigNumber.from(m.configuration.delegateBadge.tokenId)],
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
        (userReputationTokenBalance.gte(currentValue.configuration.reputationParams.submitMin) &&
          userReputationTokenBalance.lte(currentValue.configuration.reputationParams.submitMax)) ??
        false,
    };
    return accumulator;
  }, {} as Record<EvmAddress, Prereq>);
}

const TOKEN_BALANCEOF_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
