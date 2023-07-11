import { useAccount, useContractRead } from "wagmi";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "./use-root-data";

const iface = LaborMarket__factory.createInterface();

export const sigHashes = {
  submitRequest: iface.getSighash(
    iface.functions["submitRequest(uint8,(uint48,uint48,uint48,uint64,uint64,uint256,uint256,address,address),string)"]
  ) as `0x${string}`,
  signalReview: iface.getSighash(iface.functions["signalReview(uint256,uint24)"]) as `0x${string}`,
  signal: iface.getSighash(iface.functions["signal(uint256)"]) as `0x${string}`,
} as const;

export function useIsAuthorized(laborMarketAddress: EvmAddress, sig: keyof typeof sigHashes) {
  const { address: userAddress } = useAccount();

  const contracts = useContracts();

  const sigHash = sigHashes[sig];

  return useContractRead({
    enabled: !!userAddress,
    address: laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "isAuthorized",
    args: [
      // @ts-ignore "enabled" ensures userAddress is defined
      userAddress,
      sigHash,
    ],
  });
}
