import type { EventWithFilter, IndexEventResponse } from "~/routes/api+/index-event";

export async function postNewEvent(event: EventWithFilter) {
  return fetch("/api/index-event", {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<IndexEventResponse>);
}
