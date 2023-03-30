import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import { useContracts } from "./use-root-data";

const BADGER_IPFS_GATEWAY = "https://badger.mypinata.cloud";

type Props = { tokenId: string; token: string };

export function useTokenData({ token, tokenId }: Props) {
  const contracts = useContracts();
  const { data } = useContractReads({
    contracts: [
      {
        address: token as `0x${string}`,
        abi: contracts.ReputationToken.abi,
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
