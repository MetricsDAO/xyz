import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { ReputationToken } from "labor-markets-abi";
import { useContractReads } from "wagmi";

const BADGER_IPFS_GATEWAY = "https://badger.mypinata.cloud";

type Props = { tokenId: string; token: string };

export function useTokenURL({ token, tokenId }: Props) {
  const { data } = useContractReads({
    contracts: [
      {
        address: token as `0x${string}`,
        abi: ReputationToken.abi,
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

  // image attribute should exist
  return queryData?.image;
}
