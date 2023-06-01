import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { EventSchema } from "~/domain";
import { appIndexLaborMarket } from "~/domain/labor-market/index.server";
import { requireUser } from "~/services/session.server";

const bodySchema = EventSchema.extend({
  eventFilter: z.enum(["LaborMarketConfigured"]),
});
export async function action({ request }: DataFunctionArgs) {
  // await requireUser(request);
  const body = bodySchema.parse(await request.json());
  console.log("body", body);
  if (body.eventFilter === "LaborMarketConfigured") {
    await appIndexLaborMarket(body);
    return { ok: true };
  }

  return { ok: false };
}
