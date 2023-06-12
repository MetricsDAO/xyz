import type { EvmAddress } from "~/domain/address";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { fetchClaimsResponseSchema, fetchSignaturesBodySchema, fetchSignaturesResponseSchema } from "~/domain/treasury";
import env from "~/env.server";

export async function fetchSignatures(claimerAddress: EvmAddress, submissions: SubmissionWithReward[]) {
  const body = submissions.map((s) => {
    return {
      submissionID: Number(s.id),
      claimerAddress: claimerAddress,
      marketplaceAddress: s.laborMarketAddress,
      iouAddress: s.sr.configuration.pTokenProvider,
      type: "submission",
      amount: s.serviceProviderReward.reward.paymentTokenAmount,
    };
  });

  const parsedBody = fetchSignaturesBodySchema.parse(body);

  const res = await fetch(`${env.TREASURY_URL}/ioutoken/sign-claim/`, {
    method: "POST",
    body: JSON.stringify(parsedBody),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => {
    return res.json();
  });

  return fetchSignaturesResponseSchema.parse(res);
}

export async function fetchClaims(submissions: SubmissionWithReward[]) {
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

  return res;
}
