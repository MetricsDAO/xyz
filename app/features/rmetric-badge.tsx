import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";
import { displayBalance } from "~/utils/helpers";

export function RMetricBadge({ address }: { address: EvmAddress }) {
  const contracts = useContracts();
  const { data: reputationBalance } = useContractRead({
    address: contracts.ReputationToken.address,
    abi: contracts.ReputationToken.abi,
    functionName: "balanceOf",
    args: [address, BigNumber.from(REPUTATION_TOKEN_ID)],
  });

  return (
    <p className="text-xs px-2 py-1 bg-gray-100 rounded-full w-fit">
      {reputationBalance ? displayBalance(reputationBalance) : "?"} rMETRIC
    </p>
  );
}
