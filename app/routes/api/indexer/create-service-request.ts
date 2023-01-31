import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ServiceRequestIndexerSchema } from "~/domain";
import env from "~/env.server";
import { upsertServiceRequest } from "~/services/service-request.server";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  if (env.DEV_AUTO_INDEX !== "enabled") {
    return json({ error: "Not Allowed" }, { status: 403 });
  }
  const payload = await data.request.json();
  const c = ServiceRequestIndexerSchema.parse(payload);
  // return json(await upsertServiceRequest(c));
};
