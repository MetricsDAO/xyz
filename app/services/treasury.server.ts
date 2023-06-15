import type { FetchClaimsInput, FetchSignaturesBody } from "~/domain/treasury";
import { IOUTokenMetadataSchema } from "~/domain/treasury";
import { fetchClaimsResponseSchema, fetchSignaturesResponseSchema } from "~/domain/treasury";
import env from "~/env.server";

export async function fetchSignatures(body: FetchSignaturesBody) {
  const res = await fetch(`${env.TREASURY_URL}/ioutoken/sign-claim/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => {
    return res.json();
  });

  return fetchSignaturesResponseSchema.parse(res);
}

export async function fetchClaims(input: FetchClaimsInput) {
  return await Promise.all(
    input.map(async (i) => {
      const { marketplaceAddress, participationId, type } = i;
      const res = await fetch(`${env.TREASURY_URL}/claims/${marketplaceAddress}/${participationId}/${type}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
      }).then((res) => res.json());
      return fetchClaimsResponseSchema.parse(res);
    })
  );
}

export async function fetchIouTokenMetadata() {
  const res = await fetch(`${env.TREASURY_URL}/ioutoken/metadata`, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => {
    return res.json();
  });

  return IOUTokenMetadataSchema.parse(res);
}
