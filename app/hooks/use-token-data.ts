import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import type { EvmAddress } from "~/domain/address";

const BADGER_IPFS_GATEWAY = "https://badger.mypinata.cloud";

type Props = { tokenId: string; token: EvmAddress };

const PARTIAL_BADGER_TOKEN_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useTokenData({ token, tokenId }: Props) {
  const { data } = useContractReads({
    contracts: [
      {
        address: token,
        abi: PARTIAL_BADGER_TOKEN_ABI,
        functionName: "uri",
        args: [BigNumber.from(tokenId)],
      },
    ],
  });

  const { data: queryData } = useQuery({
    enabled: !!data?.[0],
    queryKey: ["useTokenURL", token, tokenId],
    queryFn: () => fetch(`${BADGER_IPFS_GATEWAY}/ipfs/${data?.[0]}`).then((res) => res.json()),
  });

  return queryData;
}
