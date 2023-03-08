import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { forbidden } from "remix-utils";
import { z } from "zod";
import env from "~/env.server";
import { findWalletsByUserAddress } from "~/services/user.server";

const paramSchema = z.object({ address: z.string() });
// Get user info by wallet address. Initially build for use by Treasury team to find wallet addresses for a user.
export async function loader({ request, params }: DataFunctionArgs) {
  const apiKey = request.headers.get("x-api-key");

  if (env.FLIPSIDE_API_KEY !== apiKey) {
    throw forbidden({ error: "Not allowed" });
  }

  const { address } = getParamsOrFail(params, paramSchema);

  const wallets = await findWalletsByUserAddress(address);

  return wallets;
}
