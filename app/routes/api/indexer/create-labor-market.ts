import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { upsertLaborMarket } from "~/services/labor-market.server";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  const payload = await data.request.json();
  await upsertLaborMarket(payload);
  return 200;
};
