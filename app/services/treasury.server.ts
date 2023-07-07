import type { FetchClaimsInput, FetchSignaturesBody, IOUTokenPost, requestMint } from "~/domain/treasury";
import { mintResponseSchema } from "~/domain/treasury";
import { requestMintSchema } from "~/domain/treasury";
import {
  IOUMetadataResponseSchema,
  IOUTokenMetadataSchema,
  fetchClaimsResponseSchema,
  fetchSignaturesResponseSchema,
} from "~/domain/treasury";
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
      const res = await fetch(`${env.TREASURY_URL}/ioutoken/claims/${marketplaceAddress}/${participationId}/${type}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
      }).then((res) => {
        return res.json();
      });
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

export async function postIouTokenMetadata(body: IOUTokenPost) {
  console.log("body", body);
  const res = await fetch(`${env.TREASURY_URL}/ioutoken/metadata`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => {
    return res.json();
  });

  return IOUMetadataResponseSchema.parse(res);
}

export async function getMintSignature(body: requestMint) {
  const res = await fetch(`${env.TREASURY_URL}/ioutoken/request-mint`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = await res.json();
  console.log("res", data);

  try {
    const parsed = mintResponseSchema.parse(data);
    console.log("parsed", parsed);
    return parsed;
  } catch (error) {
    console.error("Error occurred during the API request:", error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
}
