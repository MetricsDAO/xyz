import { z } from "zod";
import { zfd } from "zod-form-data";

export const ClaimToSubmitPreparedSchema = z.object({
  laborMarketAddress: z.string(),
  serviceRequestId: z.string(),
});

export type ClaimToSubmitPrepared = z.infer<typeof ClaimToSubmitPreparedSchema>;
