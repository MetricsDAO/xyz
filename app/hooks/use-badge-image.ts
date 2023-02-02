import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { ReputationToken } from "labor-markets-abi";
import { useContractReads } from "wagmi";

export function useTokenURI(Token: { tokenId: string | undefined; token: string }) {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: Token.token as `0x${string}`,
        abi: ReputationToken.abi,
        functionName: "uri",
        args: [BigNumber.from(Token.tokenId)],
      },
    ],
  });
  return useSubQuery(data);
}

function useSubQuery(URI: [string]) {
  return useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch(`https://badger.mypinata.cloud/ipfs/${URI[0]}`).then((res) => res.json()),
  });
}
