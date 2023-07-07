import { z } from "zod";

export const IOUCreationFormSchema = z.object({
  name: z.string().min(1, "Required"),
  symbol: z.string().min(1, "Required"),
  destinationChain: z.string().min(1, "Required"),
  destinationAddress: z.string().min(1, "Required"),
});

export type IOUCreationForm = z.infer<typeof IOUCreationFormSchema>;
