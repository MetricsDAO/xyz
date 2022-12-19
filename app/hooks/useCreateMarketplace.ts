import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import {
  LaborMarket,
  LaborMarketNetwork,
  LikertEnforcement,
  PaymentModule,
  ReputationEngine,
  ReputationModule,
} from "labor-markets-abi";
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
    address: LaborMarketNetwork.address,
    abi: LaborMarketNetwork.abi,
    functionName: "createLaborMarket",
    args: [
      LaborMarket.address as `0x${string}`,
      data.userAddress as `0x${string}`,
      {
        network: LaborMarketNetwork.address as `0x${string}`,
        enforcementModule: LikertEnforcement.address as `0x${string}`,
        paymentModule: PaymentModule.address as `0x${string}`,
        marketUri: data.ipfsHash,
        delegateBadge: data.reviewBadgerAddress as `0x${string}`, //TODO
        delegateTokenId: BigNumber.from(1), // TODO
        maintainerBadge: data.reviewBadgerAddress as `0x${string}`,
        maintainerTokenId: BigNumber.from(data.reviewBadgerTokenId),
        reputationModule: ReputationModule.address as `0x${string}`,
        reputationConfig: {
          reputationEngine: ReputationEngine.address as `0x${string}`,
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
