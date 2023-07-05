import type { IndexEventResponse } from "~/routes/api+/index-event";
import type { Event } from "~/domain";

export async function postNewEvent(event: Event) {
  return fetch("/api/index-event", {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<IndexEventResponse>);
}
