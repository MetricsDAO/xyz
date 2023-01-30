import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { ClaimToSubmitPrepared } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";
import { changeAddressType } from "~/utils/helpers";

export function useClaimToSubmit({ data, onWriteSuccess }: Web3Hook<ClaimToSubmitPrepared>) {
  const { config } = usePrepareContractWrite({
    address: changeAddressType(data.laborMarketAddress),
    abi: LaborMarket.abi,
    functionName: "signal",
    overrides: {
      gasLimit: BigNumber.from(1000000), // TODO: What do we do here?
    },
    args: [BigNumber.from(data.serviceRequestId)],
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
