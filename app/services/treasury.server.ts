import type { RewardWithChainMeta } from "~/domain/reward/functions.server";
import { fetchClaimsResponseSchema, fetchSignaturesBodySchema, fetchSignaturesResponseSchema } from "~/domain/treasury";
import env from "~/env.server";

export async function fetchSignatures(rewards: RewardWithChainMeta[]) {
  const body = rewards
    .filter((r) => r.app.wallet !== undefined)
    .map((r) => {
      return {
        submissionID: Number(r.submission.id),
        claimerAddress: r.app.wallet?.address,
        marketplaceAddress: r.submission.laborMarketAddress,
        iouAddress: r.submission.sr.configuration.pToken,
        type: "submission",
        amount: r.chain.paymentTokenAmount,
      };
    });

  const parsedBody = fetchSignaturesBodySchema.parse(body);

  const res = await fetch(`${env.TREASURY_URL}/ioutoken/sign-claim/`, {
    method: "POST",
    body: JSON.stringify(parsedBody),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => res.json());

  return fetchSignaturesResponseSchema.parse(res);
}

export async function fetchClaims(rewards: RewardWithChainMeta[]) {
  return await Promise.all(
    rewards.map(async (r) => {
      const { laborMarketAddress, id: submissionId } = r.submission;
      const res = await fetch(`${env.TREASURY_URL}/ioutoken/claims/${laborMarketAddress}/${submissionId}/submission`, {
        method: "GET",
        headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
      }).then((res) => res.json());
      return fetchClaimsResponseSchema.parse(res);
    })
  );
}
