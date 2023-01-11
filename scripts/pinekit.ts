import { z } from "zod";

// Create a tracer in Pine for the given contracts and events.
const CreateTracerPayload = z.object({
  namespace: z.string(),
  version: z.string(),
  blockchain: z.object({
    name: z.string(),
    network: z.string(),
  }),
  contracts: z.array(
    z.object({
      name: z.string(),
      addresses: z.array(z.string()),
      schema: z.any(),
    })
  ),
});

export class Pinekit {
  constructor(private apiKey: string) {}

  async createTracer(payload: z.infer<typeof CreateTracerPayload>) {
    const res = await this.#request("/tracers", {
      method: "post",
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  #request(path: string, options: RequestInit) {
    return fetch(`https://pine.lab3547.xyz/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
    });
  }
}
