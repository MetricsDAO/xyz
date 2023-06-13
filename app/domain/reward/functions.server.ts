import type { Reward, Token, User, Wallet } from "@prisma/client";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { z } from "zod";
import { mongo } from "~/services/mongo.server";
import { listTokens } from "~/services/tokens.server";
import { fetchSignatures, fetchClaims, fetchIouTokenMetadata } from "~/services/treasury.server";
import { findAllWalletsForUser } from "~/services/wallet.server";
import { getContracts } from "~/utils/contracts.server";
import { utcDate } from "~/utils/date";
import type { SubmissionDoc, SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { FetchClaimsResponse, FetchSignaturesResponse } from "../treasury";
import { IOUData } from "./schema";
import type { RewardsSearch } from "./schema";
import { findAllRewardsForUser } from "~/services/reward.server";
import { prisma } from "~/services/prisma.server";
import { ACTIONS } from "~/hooks/use-has-performed";
import type { EvmAddress } from "../address";
import invariant from "tiny-invariant";

type RewardWithWallet = {
  reward: Reward & { token: Token | null };
  wallet?: Wallet;
};

export type SubmissionWithReward = SubmissionWithServiceRequest & { serviceProviderReward: RewardWithWallet };

const getRewardData = async (
  user: User,
  submissions: SubmissionWithServiceRequest[]
): Promise<SubmissionWithReward[]> => {
  const wallets = await findAllWalletsForUser(user.id);
  const rewards = await findAllRewardsForUser(user.id);

  return submissions.map((s) => {
    const reward = rewards.find((r) => r.submissionId === s.id && r.laborMarketAddress === s.laborMarketAddress);
    const wallet = wallets.find((w) => w.networkName === reward?.token?.networkName);
    invariant(reward, "Reward should exist");
    return {
      ...s,
      serviceProviderReward: {
        reward,
        wallet,
      },
    };
  });
};

const updateTreasuryClaimStatus = async (user: User, submissions: SubmissionWithReward[]) => {
  const iouSubmissions = submissions.filter((s) => {
    const { isIou, iouHasRedeemed } = s.serviceProviderReward.reward;
    return isIou && !iouHasRedeemed;
  });
  if (iouSubmissions.length === 0) {
    return;
  }

  const signatures = await fetchSignatures(user.address as EvmAddress, iouSubmissions);
  const claims = await fetchClaims(iouSubmissions);

  for (const s of iouSubmissions) {
    const iouSignature = getSignature(signatures, s)?.signature;
    const iouHasRedeemed = hasRedeemed(claims, s);
    await prisma.reward.update({
      where: {
        laborMarketAddress_submissionId: {
          laborMarketAddress: s.laborMarketAddress,
          submissionId: s.id,
        },
      },
      data: {
        iouHasRedeemed,
        iouSignature,
      },
    });
  }
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

const createRewards = async (user: User, submissions: SubmissionWithServiceRequest[]) => {
  if (submissions.length === 0) return;

  const contracts = getContracts();
  // multicall that returns all the rewards in format [BigNumber, BigNumber][]
  // where first element is the payment token amount and the second is the reputation token amount
  const m = (await multicall({
    contracts: submissions.map((s) => {
      return {
        address: contracts.BucketEnforcement.address,
        abi: contracts.BucketEnforcement.abi,
        functionName: "getRewards",
        args: [s.laborMarketAddress, BigNumber.from(s.sr.id), BigNumber.from(s.id)],
      };
    }),
  })) as [BigNumber, BigNumber, BigNumber][];

  const tokens = await listTokens();
  await prisma.reward.createMany({
    data: submissions.map((s, index) => {
      const getReward = m[index]!;
      const token = tokens.find((t) => t.contractAddress === s.sr.configuration.pTokenProvider);
      return {
        userId: user.id,
        submissionId: s.id,
        laborMarketAddress: s.laborMarketAddress,
        hasClaimed: false,
        tokenId: token?.id,
        isIou: token?.isIou ?? false,
        hasReward: getReward[0].gt(0) || getReward[1].gt(0),
        paymentTokenAmount: getReward[0].toString(),
        reputationTokenAmount: getReward[1].toString(),
      };
    }),
  });
};

const updateClaimStatus = async (user: User, submissions: SubmissionWithReward[]) => {
  const unclaimedRewards = submissions.filter(
    (s) => s.serviceProviderReward.reward.hasClaimed === false && s.serviceProviderReward.reward.hasReward === true
  );
  if (unclaimedRewards.length === 0) {
    return;
  }
  const contracts = getContracts();
  const m = (await multicall({
    contracts: unclaimedRewards.map((s) => {
      return {
        address: s.laborMarketAddress,
        abi: contracts.LaborMarket.abi,
        functionName: "hasPerformed",
        args: [BigNumber.from(s.id), user.address as EvmAddress, ACTIONS.HAS_CLAIMED],
      };
    }),
  })) as boolean[];

  for (const [index, hasClaimed] of m.entries()) {
    if (hasClaimed) {
      const s = unclaimedRewards[index]!;
      await prisma.reward.update({
        where: {
          laborMarketAddress_submissionId: {
            laborMarketAddress: s.laborMarketAddress,
            submissionId: s.id,
          },
        },
        data: {
          hasClaimed: true,
        },
      });
    }
  }
};

/**
 * To prevent unnecessary calls to the blockchain and treasury service, which slows down page load, we can cache the rewards related data
 * in our mongodb in much the same way the indexer caches other data.
 *
 * This should be called immediately before we ever show a user's rewards to avoid showing stale data.
 * @param user
 * @param submissions
 */
const synchronizeRewards = async (user: User, submissions: SubmissionWithServiceRequest[]) => {
  let rewards = await findAllRewardsForUser(user.id);
  const submissionsMissingReward = submissions.filter(
    (s) => rewards.find((r) => r.submissionId === s.id && r.laborMarketAddress === s.laborMarketAddress) === undefined
  );

  await createRewards(user, submissionsMissingReward);

  const withRewards = await getRewardData(user, submissions);

  // Could probably run these concurrently
  await updateClaimStatus(user, withRewards);
  await updateTreasuryClaimStatus(user, withRewards);
};

const searchUserSubmissions = async (params: RewardsSearch): Promise<SubmissionWithServiceRequest[]> => {
  const submissionsDocs = await mongo.submissions
    .aggregate(searchSubmissionsPipeline(params))
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();

  return z.array(SubmissionWithServiceRequestSchema).parse(submissionsDocs);
};

type SearchSubmissionsWithReward = Pick<RewardsSearch, "fulfiller" | "q" | "token" | "isPastEnforcementExpiration">;
export const countSubmissionsWithRewards = async (params: SearchSubmissionsWithReward) => {
  const agg = await mongo.submissions
    .aggregate([
      ...searchSubmissionsPipeline(params),
      {
        $count: "match_count",
      },
    ])
    .toArray();
  return agg[0]?.match_count ?? 0;
};

const searchSubmissionsPipeline = (params: SearchSubmissionsWithReward) => {
  return [
    {
      $match: {
        $and: [
          params.fulfiller ? { "configuration.fulfiller": params.fulfiller } : {},
          params.q ? { $text: { $search: params.q } } : {},
        ],
      },
    },
    {
      $lookup: {
        from: "serviceRequests",
        let: {
          sr_id: "$serviceRequestId",
          m_addr: "$laborMarketAddress",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$id", "$$sr_id"] },
                  { $eq: ["$laborMarketAddress", "$$m_addr"] },
                  params.token
                    ? {
                        serviceRequestRewardPools: { $elemMatch: { "$configuration.pToken": { $in: params.token } } },
                      }
                    : {},
                ],
              },
            },
          },
        ],
        as: "sr",
      },
    },
    {
      $unwind: "$sr",
    },
    ...(params.isPastEnforcementExpiration
      ? [
          {
            $match: {
              $and: [{ "sr.configuration.enforcementExp": { $lt: utcDate() } }],
            },
          },
        ]
      : []),
  ];
};

export const getSubmissionWithRewards = async (user: User, search: RewardsSearch) => {
  const submissions = await searchUserSubmissions(search);
  await synchronizeRewards(user, submissions);
  return await getRewardData(user, submissions);
};

export const getIOUTokenData = async () => {
  const tokens = await fetchIouTokenMetadata();
  const cleanTokens = IOUData.parse(tokens);
  return cleanTokens;
};
