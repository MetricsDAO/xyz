import { BigNumber } from "ethers";
import {
  LaborMarket,
  LaborMarketNetwork,
  PaymentModule,
  ReputationModule,
  ConstantLikertEnforcement,
  ReputationToken,
} from "labor-markets-abi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import type { LaborMarketContract } from "~/domain";
import type { Web3Hook } from "~/features/web3-button/types";
import { REPUTATION_TOKEN_ID } from "~/utils/constants";

export function useCreateLaborMarket({ data, onWriteSuccess }: Web3Hook<LaborMarketContract>) {
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
          enforcement: ConstantLikertEnforcement.address,
          network: LaborMarketNetwork.address,
          payment: PaymentModule.address,
          reputation: ReputationModule.address,
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
          rewardPool: BigNumber.from(5000),
          signalStake: BigNumber.from(5),
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
