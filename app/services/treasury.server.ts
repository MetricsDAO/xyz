import type { SubmissionWithAppData } from "~/domain/reward/functions.server";
import { fetchClaimsResponseSchema, fetchSignaturesBodySchema, fetchSignaturesResponseSchema } from "~/domain/treasury";
import env from "~/env.server";

export async function fetchSignatures(submissions: SubmissionWithAppData[]) {
  const body = submissions.map((s) => {
    return {
      submissionID: Number(s.id),
      claimerAddress: s.app.wallet?.address,
      marketplaceAddress: s.laborMarketAddress,
      iouAddress: s.sr.configuration.pToken,
      type: "submission",
      amount: s.app.reward?.paymentTokenAmount,
    };
  });

  const parsedBody = fetchSignaturesBodySchema.parse(body);

  const res = await fetch(`${env.TREASURY_URL}/ioutoken/sign-claim/`, {
    method: "POST",
    body: JSON.stringify(parsedBody),
    headers: { "Content-Type": "application/json", authorization: env.TREASURY_API_KEY },
  }).then((res) => {
    console.log("res", res);
    return res.json();
  });

  return fetchSignaturesResponseSchema.parse(res);
}

export async function fetchClaims(submissions: SubmissionWithAppData[]) {
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
