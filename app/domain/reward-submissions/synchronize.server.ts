import invariant from "tiny-invariant";
import { mongo } from "~/services/mongo.server";
import { listTokens } from "~/services/tokens.server";
import { fetchClaims, fetchSignatures } from "~/services/treasury.server";
import { getContracts } from "~/utils/contracts.server";
import type { SubmissionDoc, SubmissionWithServiceRequest } from "../submission/schemas";
import type { FetchClaimsResponse, FetchSignaturesResponse } from "../treasury";
import { fetchSignaturesBodySchema } from "../treasury";
import { BucketEnforcement__factory } from "~/contracts";
import { nodeProvider } from "~/services/node.server";

const updateTreasuryData = async (submissions: SubmissionWithServiceRequest[]) => {
  const iouSubmissions = submissions.filter((s) => s.reward?.isIou === true && !s.reward?.iouHasRedeemed);
  if (iouSubmissions.length === 0) {
    return;
  }
  const fetchSignaturesBody = iouSubmissions.map((s) => {
    invariant(s.reward?.tokenAmount, `submission ${s.id} has no tokenAmount`);
    return {
      participationID: s.id,
      claimerAddress: s.configuration.fulfiller,
      marketplaceAddress: s.laborMarketAddress,
      iouAddress: s.sr.configuration.pTokenProvider,
      type: "submission",
      amount: s.reward.tokenAmount,
    };
  });

  const signatures = await fetchSignatures(fetchSignaturesBodySchema.parse(fetchSignaturesBody));
  const claims = await fetchClaims(
    iouSubmissions.map((s) => {
      return {
        marketplaceAddress: s.laborMarketAddress,
        participationId: s.id,
        type: "submission",
      };
    })
  );

  await Promise.all(
    iouSubmissions.map(async (s) => {
      const iouSignature = getSignature(signatures, s)?.signature;
      const iouHasRedeemed = hasRedeemed(claims, s);
      invariant(s.reward, `submission ${s.id} has no reward`);
      await mongo.submissions.updateOne(
        {
          laborMarketAddress: s.laborMarketAddress,
          serviceRequestId: s.serviceRequestId,
          id: s.id,
        },
        {
          $set: {
            reward: {
              ...s.reward,
              iouSignature,
              iouHasRedeemed,
            },
          },
        }
      );
    })
  );
};

const getSignature = (signatures: FetchSignaturesResponse, submission: SubmissionDoc) => {
  return signatures.find(
    (c) =>
      c.signedBody.marketplaceAddress === submission.laborMarketAddress &&
      c.signedBody.participationID === submission.id
  );
};

const hasRedeemed = (claims: FetchClaimsResponse[], submission: SubmissionDoc) => {
  const redemptedClaim = claims.find((c) => {
    return c.claims.val.find(
      (v) =>
        v.marketplaceAddress === submission.laborMarketAddress &&
        v.participationID === submission.id &&
        v.iouAddress === submission.reward?.tokenAddress &&
        v.redeemTx !== null
    );
  });

  return !!redemptedClaim;
};

const updateRewards = async (submissions: SubmissionWithServiceRequest[]) => {
  const contracts = getContracts();
  const contract = BucketEnforcement__factory.connect(contracts.BucketEnforcement.address, nodeProvider);

  const sumissionsMissingRewards = submissions.filter((s) => !s.reward);

  if (sumissionsMissingRewards.length === 0) return;

  const rewards = await Promise.all(
    sumissionsMissingRewards.map((s) => contract.callStatic.getRewards(s.laborMarketAddress, s.serviceRequestId, s.id))
  );

  const tokens = await listTokens();

  await Promise.all(
    sumissionsMissingRewards.map(async (s, index) => {
      const getReward = rewards[index]!;
      const token = tokens.find((t) => t.contractAddress === s.sr.configuration.pTokenProvider);
      await mongo.submissions.updateOne(
        {
          laborMarketAddress: s.laborMarketAddress,
          serviceRequestId: s.sr.id,
          id: s.id,
        },
        {
          $set: {
            reward: {
              tokenAmount: getReward.toString(),
              tokenAddress: s.sr.configuration.pTokenProvider,
              isIou: token?.isIou ?? false,
            },
          },
        }
      );
    })
  );
};

/**
 * To prevent unnecessary calls to the blockchain and treasury service, which slows down page load, we can cache the rewards related data
 * in our mongodb in much the same way the indexer caches other data.
 *
 * This should be called immediately before we ever show a user's rewards to avoid showing stale data.
 * @param user
 * @param submissions
 */
export const synchronizeSubmissionRewards = async (submissions: SubmissionWithServiceRequest[]) => {
  await updateRewards(submissions);
  await updateTreasuryData(submissions);
};
