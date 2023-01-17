import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import {
  LaborMarket,
  LaborMarketNetwork,
  LikertEnforcement,
  PaymentModule,
  ReputationModule,
  ReputationEngine,
} from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { LaborMarketContract } from "~/domain";
import { createLaborMarket } from "~/utils/fetch";
import { removeLeadingZeros } from "~/utils/helpers";

export function useCreateLaborMarket({
  data,
  onTransactionSuccess,
  onWriteSuccess,
}: {
  data: LaborMarketContract;
  onWriteSuccess?: () => void;
  onTransactionSuccess?: (data: TransactionReceipt) => void;
}) {
  const { config } = usePrepareContractWrite({
    address: LaborMarketNetwork.address,
    abi: LaborMarketNetwork.abi,
    functionName: "createLaborMarket",
    args: [
      LaborMarket.address,
      data.userAddress as `0x${string}`,
      {
        network: LaborMarketNetwork.address,
        enforcementModule: LikertEnforcement.address,
        paymentModule: PaymentModule.address,
        marketUri: data.ipfsHash,
        delegateBadge:
          data.launch.access === "delegates"
            ? (data.launch.badgerAddress as `0x${string}`)
            : "0x9D2D6c0D2563E4540046279054774e165e85eE1F", // hardcoded to a Badger address
        delegateTokenId: BigNumber.from(data.launch.access === "delegates" ? data.launch.badgerTokenId : 0),
        maintainerBadge: data.reviewBadgerAddress as `0x${string}`,
        maintainerTokenId: BigNumber.from(data.reviewBadgerTokenId),
        reputationModule: ReputationModule.address,
        reputationConfig: {
          reputationEngine: ReputationEngine.address,
          signalStake: BigNumber.from(1),
          submitMin: BigNumber.from(data.submitRepMin),
          submitMax: BigNumber.from(data.submitRepMax),
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
    async onSuccess(receipt) {
      if (window.ENV.DEV_AUTO_INDEX) {
        createLaborMarket({
          ...data,
          address: removeLeadingZeros(receipt.logs[0]?.topics[1] as string), // The labor market created address
          sponsorAddress: data.userAddress,
        });
      }

      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
