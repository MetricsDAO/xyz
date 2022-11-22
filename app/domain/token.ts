import { z } from "zod";

export const schema = z.object({
  symbol: z.string({ description: "Token trading symbol." }),
  name: z.string({ description: "Canonical token name." }),
});

export type Token = z.infer<typeof schema>;
