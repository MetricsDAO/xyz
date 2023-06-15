import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";
import { mongo } from "~/services/mongo.server";
import { listTokens } from "~/services/tokens.server";
import { fetchClaims, fetchSignatures } from "~/services/treasury.server";
import { getContracts } from "~/utils/contracts.server";
import type { SubmissionDoc, SubmissionWithServiceRequest } from "../submission/schemas";
import type { FetchClaimsResponse, FetchSignaturesResponse } from "../treasury";
import { fetchSignaturesBodySchema } from "../treasury";

const updateTreasuryData = async (submissions: SubmissionWithServiceRequest[]) => {
  const iouSubmissions = submissions.filter((s) => s.reward?.isIou === true && s.reward?.iouHasRedeemed === false);
  if (iouSubmissions.length === 0) {
    return;
  }

  const fetchSignaturesBody = iouSubmissions.map((s) => {
    invariant(s.reward?.tokenAmount, `submission ${s.id} has no tokenAmount`);
    return {
      submissionID: Number(s.id),
      claimerAddress: s.configuration.fulfiller,
      marketplaceAddress: s.laborMarketAddress,
      iouAddress: s.sr.configuration.pTokenProvider,
      type: "submission",
      amount: s.reward.tokenAmount,
    };
  });

  const signatures = await fetchSignatures(fetchSignaturesBodySchema.parse(fetchSignaturesBody));
  const claims = await fetchClaims(iouSubmissions);

  await Promise.all(
    iouSubmissions.map(async (s) => {
      const iouSignature = getSignature(signatures, s)?.signature;
      const iouHasRedeemed = hasRedeemed(claims, s);
      await mongo.submissions.updateOne(
        {
          id: s.id,
          serviceRequestId: s.serviceRequestId,
          laborMarketAddress: s.laborMarketAddress,
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

const getSignature = (signatures: FetchSignaturesResponse, submission: SubmissionDoc) => {
  return signatures.find(
    (c) =>
      c.signedBody.marketplaceAddress === submission.laborMarketAddress &&
      c.signedBody.submissionID === Number(submission.id)
  );
};

const hasRedeemed = (claims: FetchClaimsResponse[], submission: SubmissionDoc) => {
  const redemptedClaim = claims.find((c) => {
    return c.claims.val.find(
      (v) =>
        v.marketplaceAddress === submission.laborMarketAddress &&
        v.submissionID === Number(submission.id) &&
        v.redeemTx !== null
    );
  });

  return !!redemptedClaim;
};

const updateRewards = async (submissions: SubmissionWithServiceRequest[]) => {
  const sumissionsMissingRewards = submissions.filter((s) => !s.reward);

  if (sumissionsMissingRewards.length === 0) return;

  const contracts = getContracts();
  // TODO getRewards is not readable yet
  // multicall that returns all the reward amounts in format BigNumber[] which is an array of the payout amount
  // const m = (await multicall({
  //   contracts: sumissionsMissingRewards.map((s) => {
  //     return {
  //       address: contracts.BucketEnforcement.address,
  //       abi: contracts.BucketEnforcement.abi,
  //       functionName: "getRewards",
  //       args: [s.laborMarketAddress, BigNumber.from(s.id)],
  //     };
  //   }),
  // })) as BigNumber[];

  const m = submissions.map((s) => BigNumber.from("1000000000"));

  console.log("m", m);

  const tokens = await listTokens();

  await Promise.all(
    sumissionsMissingRewards.map(async (s, index) => {
      const getReward = m[index]!;
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
