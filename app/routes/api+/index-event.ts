import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { z } from "zod";
import { EventSchema } from "~/domain";
import { appLaborMarketConfiguredEvent } from "~/domain/labor-market/index.server";
import { appRequestConfiguredEvent } from "~/domain/service-request/index.server";
import { requireUser } from "~/services/session.server";

const EventWithFilterSchema = EventSchema.extend({
  eventFilter: z.enum(["LaborMarketConfigured", "RequestConfiguredEvent"]),
});
export type EventWithFilter = z.infer<typeof EventWithFilterSchema>;
export type IndexEventResponse = Awaited<ReturnType<typeof action>>;
export async function action({ request }: DataFunctionArgs) {
  // only authenticated users can call this
  // await requireUser(request);
  const requestBody = EventWithFilterSchema.parse(await request.json());

  await parseEventFilter(requestBody);

  return { ok: true };
}

async function parseEventFilter(event: EventWithFilter) {
  switch (event.eventFilter) {
    case "LaborMarketConfigured":
      await appLaborMarketConfiguredEvent(event);
      break;
    case "RequestConfiguredEvent":
      await appRequestConfiguredEvent(event);
      break;
    default:
      throw new Error(`Unknown event filter: ${event.eventFilter}`);
  }
}
