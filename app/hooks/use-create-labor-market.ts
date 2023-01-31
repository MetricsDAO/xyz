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

type Props = Web3Hook<LaborMarketContract>;

export function useCreateLaborMarket({ data, onWriteSuccess }: Props) {
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
          token: data.launch.access === "delegates" ? (data.launch.badgerAddress as `0x${string}`) : "0x0", // hardcoded to a Badger address
          tokenId: BigNumber.from(data.launch.access === "delegates" ? data.launch.badgerTokenId : 0),
        },
        maintainerBadge: {
          token: data.reviewBadgerAddress as `0x${string}`,
          tokenId: BigNumber.from(data.reviewBadgerTokenId),
        },
        reputationBadge: {
          token: ReputationToken.address,
          tokenId: BigNumber.from(4), //TODO const
        },
        reputationParams: {
          rewardPool: BigNumber.from(5000),
          signalStake: BigNumber.from(5),
          submitMin: BigNumber.from(10),
          submitMax: BigNumber.from(1e15),
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
