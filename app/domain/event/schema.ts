import { z } from "zod";
import { EvmAddressSchema } from "../address";

export const EventSchema = z.object({
  address: EvmAddressSchema,
  blockNumber: z.number(),
  transactionHash: z.string(),
});

export type Event = z.infer<typeof EventSchema>;

export const EventDocSchema = EventSchema.extend({
  args: z.any(),
});

export type EventDoc = z.infer<typeof EventDocSchema>;
