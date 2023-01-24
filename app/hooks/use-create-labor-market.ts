import { BigNumber } from "ethers";
import {
  LaborMarket,
  LaborMarketNetwork,
  LikertEnforcement,
  PaymentModule,
  ReputationEngine,
  ReputationModule,
} from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { LaborMarketContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";

export function useCreateLaborMarket({ data, onWriteSuccess }: Web3Hook<LaborMarketContract>) {
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
            : "0xce5dFf7E45187fDEb10fAc24c3cFB20E039ac5fd", // hardcoded to a Badger address
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
