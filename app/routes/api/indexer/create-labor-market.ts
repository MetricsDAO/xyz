import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { LaborMarketSchema } from "~/domain";
import env from "~/env.server";
import { forbidden } from "remix-utils";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  if (!env.DEV_AUTO_INDEX) {
    throw forbidden({ error: "Not allowed" });
  }
  const payload = await data.request.json();
  const lm = LaborMarketSchema.parse(payload);
  // return json(await upsertLaborMarket(lm));
};
