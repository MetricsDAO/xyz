import { z } from "zod";
import { EvmAddressSchema } from "./address";

export const PayClaimedEventSchema = z.object({
  claimer: EvmAddressSchema,
  requestId: z.string(),
  submissionId: z.string(),
  payAmount: z.string(),
  to: EvmAddressSchema,
});
