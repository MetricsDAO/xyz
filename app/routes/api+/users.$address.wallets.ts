import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { forbidden } from "remix-utils";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import env from "~/env.server";
import { findWalletsByUserAddress } from "~/services/user.server";

const paramSchema = z.object({ address: EvmAddressSchema });
export async function loader({ request, params }: DataFunctionArgs) {
  const apiKey = request.headers.get("x-api-key");

  if (env.FLIPSIDE_API_KEY !== apiKey) {
    throw forbidden({ error: "Not allowed" });
  }

  const { address } = getParamsOrFail(params, paramSchema);

  const wallets = await findWalletsByUserAddress(address);

  return wallets;
}
