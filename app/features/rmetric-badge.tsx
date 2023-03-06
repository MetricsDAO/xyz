import { BigNumber } from "ethers";
import { ReputationToken } from "labor-markets-abi";
import { useContractRead } from "wagmi";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";
import { displayBalance } from "~/utils/helpers";

export function RMetricBadge({ address }: { address: `0x${string}` }) {
  const { data: reputationBalance } = useContractRead({
    address: ReputationToken.address,
    abi: ReputationToken.abi,
    functionName: "balanceOf",
    args: [address, BigNumber.from(REPUTATION_TOKEN_ID)],
  });

  return (
    <p className="text-xs px-2 py-1 bg-gray-100 rounded-full w-fit">
      {reputationBalance ? displayBalance(reputationBalance) : "?"} rMETRIC
    </p>
  );
}
