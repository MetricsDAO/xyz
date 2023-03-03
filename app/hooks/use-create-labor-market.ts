import { BigNumber, ethers } from "ethers";
import {
  LaborMarket,
  LaborMarketNetwork,
  ReputationModule,
  ReputationToken,
  ScalableLikertEnforcement,
} from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { LaborMarketContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";
import {
  REPUTATION_REWARD_POOL,
  REPUTATION_REVIEW_SIGNAL_STAKE,
  REPUTATION_SUBMIT_SIGNAL_STAKE,
  REPUTATION_TOKEN_ID,
} from "~/utils/constants";

export function useCreateLaborMarket({
  data,
  onWriteSuccess,
  onPrepareTransactionError,
}: Web3Hook<LaborMarketContract>) {
  const { config } = usePrepareContractWrite({
    address: LaborMarketNetwork.address,
    abi: LaborMarketNetwork.abi,
    functionName: "createLaborMarket",
    args: [
      LaborMarket.address,
      {
        marketUri: data.ipfsHash,
        owner: data.userAddress as `0x${string}`,
        modules: {
          network: LaborMarketNetwork.address,
          reputation: ReputationModule.address,
          enforcement: ScalableLikertEnforcement.address,
          enforcementKey: ethers.utils.formatBytes32String("aggressive") as `0x${string}`,
        },
        delegateBadge: {
          token: data.launch.badgerAddress as `0x${string}`,
          tokenId: BigNumber.from(data.launch.badgerTokenId),
        },
        maintainerBadge: {
          token: data.reviewBadgerAddress as `0x${string}`,
          tokenId: BigNumber.from(data.reviewBadgerTokenId),
        },
        reputationBadge: {
          token: ReputationToken.address,
          tokenId: BigNumber.from(REPUTATION_TOKEN_ID),
        },
        reputationParams: {
          rewardPool: BigNumber.from(REPUTATION_REWARD_POOL),
          reviewStake: BigNumber.from(REPUTATION_REVIEW_SIGNAL_STAKE),
          provideStake: BigNumber.from(REPUTATION_SUBMIT_SIGNAL_STAKE),
          submitMin: BigNumber.from(data.submitRepMin),
          submitMax: BigNumber.from(data.submitRepMax !== undefined ? data.submitRepMax : ethers.constants.MaxUint256),
        },
      },
    ],
    onError(err) {
      onPrepareTransactionError?.(err);
    },
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
