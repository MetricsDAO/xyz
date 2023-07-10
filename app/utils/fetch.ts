import type { IndexEventResponse } from "~/routes/api+/index-event";
import type { Event } from "~/domain";
import type { IOUPost } from "~/domain/treasury";

export async function postNewEvent(event: Event) {
  return fetch("/api/index-event", {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<IndexEventResponse>);
}

export async function PostAndSaveToken(data: IOUPost) {
  const res = await fetch("/api/post-token-metadata", {
    body: JSON.stringify(data),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return json;
}
