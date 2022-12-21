import { z } from "zod";
import { EthAddressSchema, SolAddressSchema } from "./address";

export const addWalletSchema = z.object({
  payment: z.discriminatedUnion("networkName", [
    z.object({ networkName: z.literal("Ethereum"), address: EthAddressSchema }),
    z.object({ networkName: z.literal("Solana"), address: SolAddressSchema }),
  ]),
});

export const updateWalletSchema = z.object({
  payment: z.discriminatedUnion("networkName", [
    z.object({ networkName: z.literal("Ethereum"), address: EthAddressSchema }),
    z.object({ networkName: z.literal("Solana"), address: SolAddressSchema }),
  ]),
  currentAddress: z.string({ description: "The current address of the wallet." }),
});

export const deleteWalletSchema = z.object({
  currentAddress: z.string({ description: "The current address of the wallet." }),
});
