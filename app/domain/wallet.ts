import { z } from "zod";
import { EvmAddressSchema } from "./address";

export const PaymentAddressSchema = z.discriminatedUnion("networkName", [
  z.object({ networkName: z.literal("Polygon"), address: EvmAddressSchema }),
  z.object({ networkName: z.literal("Ethereum"), address: EvmAddressSchema }),
]);

export const WalletAddSchema = z.object({
  payment: PaymentAddressSchema,
});

export const WalletDeleteSchema = z.object({
  id: z.string({ description: "The id of the current wallet." }),
});

export type WalletDelete = z.infer<typeof WalletDeleteSchema>;
export type WalletAdd = z.infer<typeof WalletAddSchema>;
