import type { UseFormReturnType } from "@mantine/form";
import { BigNumber } from "ethers";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import type { LaborMarketNew } from "~/domain";

const DEV_TEST_CONTRACT_ADDRESS = "0xd138D0B4F007EA66C8A8C0b95E671ffE788aa6A9";

export function useCreateMarketplace(form: UseFormReturnType<LaborMarketNew>) {
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
    enabled: form.isValid(),
    args: form.isValid() ? [BigNumber.from(form.values.title.charCodeAt(0))] : [BigNumber.from(0)], //mocking
  });

  return useContractWrite(config);
}
