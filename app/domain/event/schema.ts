import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const EventKeySchema = z.object({
  address: EvmAddressSchema,
  blockNumber: z.number(),
  transactionHash: z.string(),
});

export type EventKey = z.infer<typeof EventKeySchema>;

export const EventDocSchema = EventKeySchema.extend({
  args: z.any(),
});

export type EventDoc = z.infer<typeof EventDocSchema>;
