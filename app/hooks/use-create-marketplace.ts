import type { TransactionReceipt } from "@ethersproject/abstract-provider";
import { BigNumber } from "ethers";
import { LaborMarket, LaborMarketNetwork, LikertEnforcement, PaymentModule, ReputationModule } from "labor-markets-abi";
import { useContractWrite, useMutation, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import type { LaborMarket as LaborMarketDomain, LaborMarketPrepared } from "~/domain";

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
        // TODO: Uncomment this once we have a way to get the badge address and token id
        // delegateBadge:
        //   data.launch.access === "delegates"
        //     ? (data.launch.badgerAddress as `0x${string}`)
        //     : (data.reviewBadgerAddress as `0x${string}`), //TODO: reviewers as delegates should not be the "anyone" case
        // delegateTokenId:
        //   data.launch.access === "delegates"
        //     ? BigNumber.from(data.launch.badgerTokenId)
        //     : BigNumber.from(data.reviewBadgerTokenId), //TODO: reviewers as delegates should not be the "anyone" case
        // maintainerBadge: data.reviewBadgerAddress as `0x${string}`,
        // maintainerTokenId: BigNumber.from(data.reviewBadgerTokenId),
        delegateBadge: "0x0d033b4307231711e437937850ebf9ff6bfeeb82",
        delegateTokenId: BigNumber.from(1),
        maintainerBadge: "0x0d033b4307231711e437937850ebf9ff6bfeeb82",
        maintainerTokenId: BigNumber.from(1),
        reputationModule: ReputationModule.address as `0x${string}`,
        reputationConfig: {
          reputationEngine: "0x305aD87b3eD2132EF1d90dF26d3081511B001650", // TODO: Manually created rep engine. Should come from labor-markets-abi in the future.
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

  // TEMP until we have the indexer
  const mutation = useMutation((data: LaborMarketDomain) =>
    fetch("/api/indexer/create-labor-market", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => res.json())
  );

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: transactionResultData?.hash,
    onError(error) {
      console.log("error", error);
    },
    async onSuccess(receipt) {
      // TEMP until we have the indexer
      console.log("receipt", receipt, receipt.logs[0]?.topics[1]);
      mutation.mutate({
        ...data,
        address: receipt.logs[0]?.topics[1] as string,
        sponsorAddress: data.userAddress,
      });

      onTransactionSuccess?.(receipt);
    },
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}
