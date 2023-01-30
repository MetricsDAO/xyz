import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { Web3Hook } from "~/features/web3-button/types";
import { changeAddressType } from "~/utils/helpers";

export type ClaimRewardContractData = { laborMarketAddress: string; submissionId: string; payoutAddress: string };

type Props = Web3Hook<ClaimRewardContractData>;

export function useClaimReward({ data, onWriteSuccess }: Props) {
  const { config } = usePrepareContractWrite({
    address: changeAddressType(data.laborMarketAddress),
    abi: LaborMarket.abi,
    functionName: "claim",
    args: [
      BigNumber.from(data.submissionId),
      changeAddressType(data.payoutAddress),
      "0x0000000000000000000000000000000000000000",
    ],
  });
  const { write } = useContractWrite({
    ...config,
    onSuccess(result) {
      onWriteSuccess?.(result);
    },
  });

  return {
    write,
  };
}
