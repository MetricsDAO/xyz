import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { useAccount } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import { sigHashes } from "./use-is-authorized";
import { useContracts } from "./use-root-data";

type Prereq = {
  canLaunchChallenges: boolean;
  canReview: boolean;
  canSubmit: boolean;
};

/**
 * lookup all the prereqs for list of labormarkets.
 * @param laborMarkets
 * @returns a React query where the data type is a map of labormarket address to prereqs.
 */
export function usePrereqsMulticall({ laborMarkets }: { laborMarkets: LaborMarketWithIndexData[] }) {
  const { address } = useAccount();
  const contracts = useContracts();
  return useQuery({
    enabled: !!address,
    queryKey: ["usePrereqsMulticall", laborMarkets],
    queryFn: async () =>
      // because of "enabled" address should be defined here. Use "!" to tell typescript that.
      prereqs(contracts, laborMarkets, address!),
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
  contracts: ReturnType<typeof useContracts>,
  laborMarkets: LaborMarketWithIndexData[],
  userAddress: EvmAddress
): Promise<Record<EvmAddress, Prereq>> {
  const launchChallengeAuthMulticall = (await multicall({
    contracts: laborMarkets.map((m) => {
      return {
        address: m.address,
        abi: contracts.LaborMarket.abi,
        functionName: "isAuthorized",
        args: [userAddress, sigHashes.submitRequest],
      };
    }),
  })) as boolean[];

  const submitAuthMulticall = (await multicall({
    contracts: laborMarkets.map((m) => {
      return {
        address: m.address,
        abi: contracts.LaborMarket.abi,
        functionName: "isAuthorized",
        args: [userAddress, sigHashes.signal],
      };
    }),
  })) as boolean[];

  const reviewAuthMulticall = (await multicall({
    contracts: laborMarkets.map((m) => {
      return {
        address: m.address,
        abi: contracts.LaborMarket.abi,
        functionName: "isAuthorized",
        args: [userAddress, sigHashes.signalReview],
      };
    }),
  })) as boolean[];

  return laborMarkets.reduce((accumulator, currentValue, index) => {
    const launchChallengeAuth = launchChallengeAuthMulticall[index];
    const submitAuth = submitAuthMulticall[index];
    const reviewAuth = reviewAuthMulticall[index];

    accumulator[currentValue.address] = {
      canLaunchChallenges: launchChallengeAuth ?? false,
      canReview: reviewAuth ?? false,
      canSubmit: submitAuth ?? false,
    };
    return accumulator;
  }, {} as Record<EvmAddress, Prereq>);
}
