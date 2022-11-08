import { BigNumber } from "ethers";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import type { LaborMarketNew } from "~/domain";

const DEV_TEST_CONTRACT_ADDRESS = "0xd138D0B4F007EA66C8A8C0b95E671ffE788aa6A9";

export function useCreateMarketplace(data?: LaborMarketNew) {
  const { config } = usePrepareContractWrite({
    address: DEV_TEST_CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "_num", type: "uint256" }],
        name: "test",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "test",
    enabled: data !== undefined,
    args: [BigNumber.from(1)], //use data in the future
  });

  return useContractWrite(config);
}
