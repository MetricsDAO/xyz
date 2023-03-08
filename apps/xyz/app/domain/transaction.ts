import { z } from "zod";

// Represents an MDAO specific transaction.
export const TxSchema = z.object({
  hash: z.string({ description: "The hash of the transaction." }),
  contract: z.string({ description: "The contract that the transaction was sent to." }),
  method: z.string({ description: "The method of the transaction." }),
  status: z.enum(["pending", "failed", "indexed"]),
});

export type Tx = z.infer<typeof TxSchema>;

export type TxCreator = (data: Tx) => Promise<Tx>;
