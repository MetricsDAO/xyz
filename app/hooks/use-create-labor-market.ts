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
import { changeAddressType } from "~/utils/helpers";

type Props = Web3Hook<LaborMarketContract>;

export function useCreateLaborMarket({ data, onWriteSuccess }: Props) {
  const { config } = usePrepareContractWrite({
    address: LaborMarketNetwork.address,
    abi: LaborMarketNetwork.abi,
    functionName: "createLaborMarket",
    args: [
      LaborMarket.address,
      changeAddressType(data.userAddress),
      {
        network: LaborMarketNetwork.address,
        enforcementModule: LikertEnforcement.address,
        paymentModule: PaymentModule.address,
        marketUri: data.ipfsHash,
        delegateBadge:
          data.launch.access === "delegates"
            ? changeAddressType(data.launch.badgerAddress)
            : "0xce5dFf7E45187fDEb10fAc24c3cFB20E039ac5fd", // hardcoded to a Badger address
        delegateTokenId: BigNumber.from(data.launch.access === "delegates" ? data.launch.badgerTokenId : 0),
        maintainerBadge: changeAddressType(data.reviewBadgerAddress),
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
