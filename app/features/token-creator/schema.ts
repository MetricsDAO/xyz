import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";

export const AddTokenFormSchema = z.object({
  tokenName: z.string(),
  tokenSymbol: z.string(),
  contractAddress: EvmAddressSchema,
  decimals: z.number(),
}); //todo - refine?

export type AddTokenForm = z.infer<typeof AddTokenFormSchema>;
