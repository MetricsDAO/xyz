import invariant from "tiny-invariant";
import { mongo } from "~/services/mongo.server";
import { fetchClaims, fetchSignatures } from "~/services/treasury.server";
import type { ReviewDoc, ReviewWithSubmission } from "../review/schemas";
import type { FetchClaimsResponse, FetchSignaturesResponse } from "../treasury";
import { fetchSignaturesBodySchema } from "../treasury";

const updateTreasuryData = async (reviews: ReviewWithSubmission[]) => {
  const iouReviews = reviews.filter((s) => s.reward?.isIou === true && s.reward?.iouHasRedeemed === false);
  if (iouReviews.length === 0) {
    return;
  }

  const fetchSignaturesBody = iouReviews.map((r) => {
    invariant(r.reward?.tokenAmount, `submission ${r.id} has no tokenAmount`);
    invariant(r.reward?.tokenAddress, `submission ${r.id} has no tokenAddress`);
    return {
      submissionID: Number(r.id),
      claimerAddress: r.reviewer,
      marketplaceAddress: r.laborMarketAddress,
      iouAddress: r.reward.tokenAddress,
      type: "submission",
      amount: r.reward.tokenAmount,
    };
  });

  const signatures = await fetchSignatures(fetchSignaturesBodySchema.parse(fetchSignaturesBody));
  const claims = await fetchClaims(
    iouReviews.map((r) => {
      return {
        marketplaceAddress: r.laborMarketAddress,
        participationId: r.id, //TODO,
        type: "review",
      };
    })
  );

  await Promise.all(
    iouReviews.map(async (r) => {
      const iouSignature = getSignature(signatures, r)?.signature;
      const iouHasRedeemed = hasRedeemed(claims, r);
      await mongo.reviews.updateOne(
        {
          laborMarketAddress: r.laborMarketAddress,
          serviceRequestId: r.serviceRequestId,
          submissionId: r.submissionId,
          id: r.id,
        },
        {
          reward: {
            iouSignature,
            iouHasRedeemed,
          },
        }
      );
    })
  );
};

const getSignature = (signatures: FetchSignaturesResponse, review: ReviewDoc) => {
  return signatures.find(
    (c) =>
      c.signedBody.marketplaceAddress === review.laborMarketAddress && c.signedBody.submissionID === Number(review.id)
  );
};

const hasRedeemed = (claims: FetchClaimsResponse[], review: ReviewDoc) => {
  const redemptedClaim = claims.find((c) => {
    return c.claims.val.find(
      (v) =>
        v.marketplaceAddress === review.laborMarketAddress &&
        v.submissionID === Number(review.id) &&
        v.redeemTx !== null
    );
  });

  return !!redemptedClaim;
};

export const synchronizeReviewRewards = async (reviews: ReviewWithSubmission[]) => {
  await updateTreasuryData(reviews);
};