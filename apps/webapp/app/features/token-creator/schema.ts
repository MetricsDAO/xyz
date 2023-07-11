import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";

export const AddTokenFormSchema = z.object({
  tokenName: z.string().min(1, "Required"),
  tokenSymbol: z.string().min(1, "Required"),
  contractAddress: EvmAddressSchema,
  decimals: z.number().min(1, "Required"),
});

export type AddTokenForm = z.infer<typeof AddTokenFormSchema>;
