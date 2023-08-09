import type { IndexEventResponse } from "~/routes/api+/index-event";
import type { Event } from "~/domain";
import type { IOUPost } from "~/domain/treasury";
import type { AddToken } from "~/routes/api+/add-token";
import type { ValidateAddressResponse } from "~/routes/api+/validate.$address";

export async function postNewEvent(event: Event) {
  return fetch("/api/index-event", {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json() as Promise<IndexEventResponse>);
}

export async function postIouToken(data: IOUPost) {
  const res = await fetch("/api/add-iou-token", {
    body: JSON.stringify(data),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return json;
}

export async function postToken(data: AddToken) {
  const res = await fetch("/api/add-token", {
    body: JSON.stringify(data),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return json;
}

export async function getIsAddressValid(address: string) {
  return await fetch(`/api/validate/${address}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json() as Promise<ValidateAddressResponse>);
}
