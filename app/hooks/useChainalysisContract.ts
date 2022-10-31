import { useContractRead } from "wagmi";
import chainalysisAbi from "~/abi/chainalysis.json";

export function useChainalysisContract(account: string) {
  return useContractRead({
    address: "0x40c57923924b5c5c5455c48d93317139addac8fb",
    abi: chainalysisAbi.abi,
    functionName: "isSanctioned",
    args: [account],
  });
}
