import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { z } from "zod";
import env from "~/env.server";

export type ValidateAddressResponse = Awaited<ReturnType<typeof loader>>;
const paramSchema = z.object({ address: z.string() });
export async function loader({ params }: DataFunctionArgs) {
  const { address } = getParamsOrFail(params, paramSchema);

  console.log("address", address);

  const isValid = await validate(address);

  return { isValid };
}

export async function validate(address: string): Promise<boolean> {
  const response = await fetch(`${env.TREASURY_URL}/validate/${address}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.valid;
}
