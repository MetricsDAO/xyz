import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { useAccount } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { useTokens } from "./use-root-data";
import type { Token } from "@prisma/client";
import type { BigNumber } from "ethers";

export interface TokenWithAllowance extends Token {
  allowance: BigNumber;
}

/**
 * lookup all the current allowances for a labormarket to use a user's allowlisted payment tokens.
 * @param laborMarketAddress the address of the labormarket to lookup.
 * @returns a React query where the data type is a map of tokens with an allowance property.
 */
export function useAllowlistAllowances({ laborMarketAddress }: { laborMarketAddress: EvmAddress }) {
  const { address: userAddress } = useAccount();
  const tokens = useTokens();

  const isEnabled = !!userAddress && !!laborMarketAddress && !!tokens;

  return useQuery({
    enabled: isEnabled,
    queryKey: ["useAllowlistAllowances", laborMarketAddress, tokens, userAddress],
    queryFn: async () =>
      // because of "enabled" userAddress should be defined here. Use "!" to tell typescript that.
      allowances(laborMarketAddress, userAddress!, tokens),
  });
}

async function allowances(
  laborMarketAddress: EvmAddress,
  userAddress: EvmAddress,
  tokens: Token[]
): Promise<TokenWithAllowance[]> {
  const allowances = await multicall({
    contracts: tokens.map((token) => {
      return {
        address: token.contractAddress as EvmAddress,
        abi: ERC20_ALLOWANCES_PARTIAL_ABI,
        functionName: "allowance",
        args: [userAddress, laborMarketAddress],
      };
    }),
  });

  return tokens.map((token, index) => ({
    ...token,
    allowance: allowances[index] as BigNumber,
  }));
}

const ERC20_ALLOWANCES_PARTIAL_ABI = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;
