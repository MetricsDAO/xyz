import { BigNumber } from "ethers";
import { ReputationToken } from "labor-markets-abi";
import { useContractRead } from "wagmi";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";
import { displayBalance } from "~/utils/helpers";
import { Badge } from "../components/badge";

export function RMetricBadge({ address }: { address: `0x${string}` }) {
  const { data: reputationBalance } = useContractRead({
    address: ReputationToken.address,
    abi: ReputationToken.abi,
    functionName: "balanceOf",
    args: [address, BigNumber.from(REPUTATION_TOKEN_ID)],
  });

  return (
    <Badge>
      <p className="text-xs px-1">{reputationBalance ? displayBalance(reputationBalance) : "?"} rMETRIC</p>
    </Badge>
  );
}
