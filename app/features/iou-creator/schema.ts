import { z } from "zod";

export const IOUCreationFormSchema = z.object({
  name: z.string().min(1, "Required"),
  symbol: z.string().min(1, "Required").max(4, "Must be 4 characters or less"),
  destinationChain: z.string().min(1, "Required"),
  destinationAddress: z.string(),
  destinationDecimals: z.string().min(1, "Required"),
  fireblocksTokenName: z.string().min(1, "Required"),
});

export type IOUCreationForm = z.infer<typeof IOUCreationFormSchema>;
