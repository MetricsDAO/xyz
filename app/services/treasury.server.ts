import type { FetchClaimsInput, FetchSignaturesBody, IOUTokenPost } from "~/domain/treasury";
import { IOUMetadataResponseSchema, IOUToken } from "~/domain/treasury";
import { IOUTokenMetadataSchema, fetchClaimsResponseSchema, fetchSignaturesResponseSchema } from "~/domain/treasury";
import env from "~/env.server";
import { mongo } from "./mongo.server";
import { prisma } from "./prisma.server";

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
  const res = await fetch(`${env.TREASURY_URL}ioutoken/metadata/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => {
    return res.json();
  });

  console.log("res", res);
  return IOUMetadataResponseSchema.parse(res);
}

export async function handleSubmitIOUToken(data: IOUTokenPost) {
  const res = await postIouTokenMetadata(data);

  await prisma.token.create({
    name: res.tokenName,
    decimals: 18,
    networkName: "Polygon",
    contractAddress: "0xCce422781e1818821f50226C14E6289a7144a898",
    symbol: "MBETA2",
  });
}
