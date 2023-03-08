import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { getParamsOrFail } from "remix-params-helper";
import { forbidden, notFound } from "remix-utils";
import { z } from "zod";
import { findUserByAddress } from "~/services/user.server";
import env from "~/env.server";

const paramSchema = z.object({ address: z.string() });
// Get user info by wallet address. Initially build for use by Treasury team to find wallet addresses for a user.
export async function loader({ request, params }: DataFunctionArgs) {
  const apiKey = request.headers.get("x-api-key");

  if (env.FLIPSIDE_API_KEY !== apiKey) {
    throw forbidden({ error: "Not allowed" });
  }

  const { address } = getParamsOrFail(params, paramSchema);

  const user = await findUserByAddress(address);
  if (!user) {
    throw notFound(`User with address ${address} not found`);
  }

  return user;
}
