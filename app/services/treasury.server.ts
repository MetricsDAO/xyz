import type { SubmissionDoc } from "~/domain/submission/schemas";
import type { FetchSignaturesBody } from "~/domain/treasury";
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

export async function fetchClaims(submissions: SubmissionDoc[]) {
  return await Promise.all(
    submissions.map(async (s) => {
      const { laborMarketAddress, id: submissionId } = s;
      const res = await fetch(`${env.TREASURY_URL}/ioutoken/claims/${laborMarketAddress}/${submissionId}/submission`, {
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
