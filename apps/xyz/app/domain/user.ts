import { z } from "zod";

export const schema = z.object({
  id: z.string({ description: "The ID of the user." }),
});

export type User = z.infer<typeof schema>;
