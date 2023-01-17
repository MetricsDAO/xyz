import { z } from "zod";
import { zfd } from "zod-form-data";

export const ClaimToSubmitPreparedSchema = z.object({
  serviceRequestId: zfd.numeric(z.number()),
});

export type ClaimToSubmitPrepared = z.infer<typeof ClaimToSubmitPreparedSchema>;
