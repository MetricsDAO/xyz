import { z } from "zod";
import {
  EvmAddressSchema,
  OsmosisAddressSchema,
  SolAddressSchema,
  NearAddressSchema,
  FlowAddressSchema,
} from "./address";

export const PaymentAddressSchema = z.discriminatedUnion("networkName", [
  z.object({ networkName: z.literal("Polygon"), address: EvmAddressSchema }),
  z.object({ networkName: z.literal("Ethereum"), address: EvmAddressSchema }),
  z.object({ networkName: z.literal("Solana"), address: SolAddressSchema }),
  z.object({ networkName: z.literal("Osmosis"), address: OsmosisAddressSchema }),
  z.object({ networkName: z.literal("Avalanche"), address: EvmAddressSchema }),
  z.object({ networkName: z.literal("NEAR"), address: NearAddressSchema }),
  z.object({ networkName: z.literal("Flow"), address: FlowAddressSchema }),
]);

export const WalletAddSchema = z.object({
  payment: PaymentAddressSchema,
});

export const WalletDeleteSchema = z.object({
  id: z.string({ description: "The id of the current wallet." }),
});

export type WalletDelete = z.infer<typeof WalletDeleteSchema>;
export type WalletAdd = z.infer<typeof WalletAddSchema>;
