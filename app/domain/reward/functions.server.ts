import type { Reward, Token, User, Wallet } from "@prisma/client";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { z } from "zod";
import { mongo } from "~/services/mongo.server";
import { listTokens } from "~/services/tokens.server";
import { fetchSignatures, fetchClaims } from "~/services/treasury.server";
import { findAllWalletsForUser } from "~/services/wallet.server";
import { getContracts } from "~/utils/contracts.server";
import { utcDate } from "~/utils/date";
import type { SubmissionDoc, SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { FetchClaimsResponse, FetchSignaturesResponse } from "../treasury";
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
  let rewards = await findAllRewardsForUser(user.id);
  const submissionsMissingReward = submissions.filter(
    (s) => rewards.find((r) => r.submissionId === s.id && r.laborMarketAddress === s.laborMarketAddress) === undefined
  );

  if (submissionsMissingReward.length > 0) {
    await createRewards(user, submissionsMissingReward);
    // Call this again to get the newly created rewards
    rewards = await findAllRewardsForUser(user.id);
  }

  const wallets = await findAllWalletsForUser(user.id);

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

const updateTreasuryClaimStatus = async (submissions: SubmissionWithReward[]) => {
  const iouSubmissions = submissions.filter(
    (r) => r.serviceProviderReward.reward?.isIou === true && !r.serviceProviderReward.reward?.iouHasRedeemed
  );
  if (iouSubmissions.length === 0) {
    return;
  }

  const signatures = await fetchSignatures(iouSubmissions);
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

const searchUserSubmissions = async (params: RewardsSearch): Promise<SubmissionWithServiceRequest[]> => {
  const submissionsDocs = await mongo.submissions
    .aggregate([
      {
        $match: {
          $and: [params.serviceProvider ? { "configuration.serviceProvider": params.serviceProvider } : {}],
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
    ])
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();

  return z.array(SubmissionWithServiceRequestSchema).parse(submissionsDocs);
};

const createRewards = async (user: User, submissions: SubmissionWithServiceRequest[]) => {
  if (submissions.length === 0) return;

  const contracts = getContracts();
  // multicall that returns all the rewards in format [BigNumber, BigNumber][]
  // where first element is the payment token amount and the second is the reputation token amount
  const m = (await multicall({
    contracts: submissions.map((s) => {
      return {
        address: contracts.ScalableLikertEnforcement.address,
        abi: contracts.ScalableLikertEnforcement.abi,
        functionName: "getRewards",
        args: [s.laborMarketAddress, BigNumber.from(s.id)],
      };
    }),
  })) as [BigNumber, BigNumber][];

  const tokens = await listTokens();
  await prisma.reward.createMany({
    data: submissions.map((s, index) => {
      const getReward = m[index]!;
      const token = tokens.find((t) => t.contractAddress === s.sr.configuration.pToken);
      return {
        userId: user.id,
        submissionId: s.id,
        laborMarketAddress: s.laborMarketAddress,
        hasClaimed: false,
        tokenId: token?.id,
        isIou: token?.iou ?? false,
        hasReward: getReward[0].gt(0) || getReward[1].gt(0),
        paymentTokenAmount: getReward[0].toString(),
        reputationTokenAmount: getReward[1].toString(),
      };
    }),
  });
};

const updateClaimStatus = async (user: User, submissions: SubmissionWithReward[]) => {
  const unclaimedRewards = submissions.filter((s) => s.serviceProviderReward.reward?.hasClaimed === false);
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

const synchronizeRewards = async (
  user: User,
  submissions: SubmissionWithServiceRequest[]
): Promise<SubmissionWithReward[]> => {
  const withRewards = await getRewardData(user, submissions);

  // Could run these concurrently
  await updateClaimStatus(user, withRewards);
  await updateTreasuryClaimStatus(withRewards);

  const withUpdatedStatus = await getRewardData(user, withRewards);
  return withUpdatedStatus;
};

export const getRewards = async (user: User, search: RewardsSearch) => {
  const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as EvmAddress });
  return await synchronizeRewards(user, submissions);
};
