import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarketNetwork } from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { LaborMarketPrepared } from "~/domain";

export function useCreateMarketplace({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: LaborMarketPrepared;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: "0x78d8d24c5a2d8717d64ba3bedb80c2500200fcbc",
    abi: LaborMarketNetwork.abi,
    functionName: "createLaborMarket",
    args: [
      "0xccbc48a243ef99f975617b0900547e32eea7f87a", // LaborMarket.address,
      "0x7A9260b97113B51aDf233d2fb3F006F09a329654", // TODO: user address?
      {
        network: "0x78d8d24c5a2d8717d64ba3bedb80c2500200fcbc", //LaborMarketNetwork.address,
        enforcementModule: "0xb6d253d25a0019d90cf67478acf73126c3cea41a", //LikertEnforcement.address,
        paymentModule: "0x59ddc8a7429cda1e02cc05057da9a77f7fb9a171", //PaymentModule.address,
        marketUri: data.ipfsHash,
        delegateBadge: "0x7A9260b97113B51aDf233d2fb3F006F09a329654", //data.reviewBadgerAddress, //TODO
        delegateTokenId: BigNumber.from(1), //data.reviewBadgerTokenId, //TODO
        maintainerBadge: data.reviewBadgerAddress as `0x${string}`,
        maintainerTokenId: BigNumber.from(data.reviewBadgerTokenId),
        reputationModule: "0x5f701ce3f83402398832fe163c40c5380466c099", //ReputationModule.address,
        reputationConfig: {
          reputationEngine: "0x42c06b7f401d8d5ae65301881ce4331de2168729", //ReputationEngine.address,
          signalStake: BigNumber.from(1), //TODO
          providerThreshold: BigNumber.from(1), //TODO
          maintainerThreshold: BigNumber.from(data.submitRepMin), //TODO
        },
      },
    ],
  });

  const { data: transactionResultData, write } = useContractWrite({
    ...config,
    onSuccess(result) {
      onWriteSuccess?.();
    },
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.log("error", error);
    },
    onSuccess(receipt) {
      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
