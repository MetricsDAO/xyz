import type { Reward } from "~/domain/reward/functions.server";
import { signClaimResponseSchema } from "~/domain/treasury";

const TREASURY_URL = "https://treasury-listeners-pine.clusters-stg.flipside.kitchen";

/**
 * Fetches a JSON object from IPFS.
 * @param cid - The CID of the JSON object to fetch.
 * @throws {Error} - If the request fails or JSON isn't valid.
 */
export async function fetchSignedClaims(rewards: Reward[]) {
  const body = rewards
    .filter((r) => r.wallet !== undefined)
    .map((r) => {
      return {
        submissionID: Number(r.submission.id),
        claimerAddress: r.wallet?.address,
        marketplaceAddress: r.submission.laborMarketAddress,
        iouAddress: r.submission.sr.configuration.pToken,
        type: "submission",
        amount: r.submission.sr.configuration.pTokenQ,
      };
    });

  console.log("body", body);

  //TODO: schema

  const res = await fetch(`${TREASURY_URL}/ioutoken/sign-claim/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", authorization: "d41d8cd98f00b204e9800998ecf8427e" },
  }).then((res) => res.json());

  return signClaimResponseSchema.parse(res);
}
