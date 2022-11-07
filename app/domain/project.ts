import { z } from "zod";

export const schema = z.object({
  id: z.string({ description: "The ID of the project." }),
  slug: z.string(),
  name: z.string(),
});

export type Project = z.infer<typeof schema>;
