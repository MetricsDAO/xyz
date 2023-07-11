import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { Event } from "~/domain";
import { EventSchema } from "~/domain";
import { appLaborMarketConfiguredEvent } from "~/domain/labor-market/index.server";
import { appRequestConfiguredEvent } from "~/domain/service-request/index.server";
import { appRequestFulfilledEvent } from "~/domain/submission/index.server";
import { requireUser } from "~/services/session.server";

export type IndexEventResponse = Awaited<ReturnType<typeof action>>;
export async function action({ request }: DataFunctionArgs) {
  // only authenticated users can call this
  await requireUser(request);
  const requestBody = EventSchema.parse(await request.json());

  await parseEventFilter(requestBody);

  return { ok: true };
}

async function parseEventFilter(event: Event) {
  switch (event.name) {
    case "LaborMarketConfigured":
      await appLaborMarketConfiguredEvent(event);
      break;
    case "RequestConfigured":
      await appRequestConfiguredEvent(event);
      break;
    case "RequestFulfilled":
      await appRequestFulfilledEvent(event);
      break;
    default:
      throw new Error(`Unknown event filter: ${event.name}`);
  }
}
