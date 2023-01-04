import { z } from "zod";
import { EthAddressSchema, SolAddressSchema } from "./address";

export const PaymentAddressSchema = z.discriminatedUnion("networkName", [
  z.object({ networkName: z.literal("Ethereum"), address: EthAddressSchema }),
  z.object({ networkName: z.literal("Solana"), address: SolAddressSchema }),
]);

export const WalletAddSchema = z.object({
  payment: PaymentAddressSchema,
});

export const WalletUpdateSchema = z.object({
  payment: PaymentAddressSchema,
  currentAddress: z.string({ description: "The current address of the wallet." }),
});

export const WalletDeleteSchema = z.object({
  currentAddress: z.string({ description: "The current address of the wallet." }),
});

export type WalletUpdate = z.infer<typeof WalletUpdateSchema>;
export type WalletDelete = z.infer<typeof WalletDeleteSchema>;
export type WalletAdd = z.infer<typeof WalletAddSchema>;
