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

type AppData = {
  reward?: Reward;
  wallet?: Wallet;
  token?: Token;
};

export type SubmissionWithAppData = SubmissionWithServiceRequest & { app: AppData };

const getAppData = async (
  user: User,
  submissions: SubmissionWithServiceRequest[]
): Promise<SubmissionWithAppData[]> => {
  const wallets = await findAllWalletsForUser(user.id);
  const rewards = await findAllRewardsForUser(user.id);
  const tokens = await listTokens();
  return submissions.map((s) => {
    const token = tokens.find((t) => t.contractAddress === s.sr.configuration.pToken);
    const reward = rewards.find((r) => r.submissionId === s.id && r.laborMarketAddress === s.laborMarketAddress);
    const wallet = wallets.find((w) => w.networkName === token?.networkName);
    return {
      ...s,
      app: {
        wallet,
        reward,
        token,
      },
    };
  });
};

const updateTreasuryClaimStatus = async (
  user: User,
  submissions: SubmissionWithAppData[]
): Promise<SubmissionWithAppData[]> => {
  const iouSubmissions = submissions.filter((r) => r.app.reward?.isIou === true && !r.app.reward?.iouHasRedeemed);
  if (iouSubmissions.length === 0) {
    return submissions;
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

  return await getAppData(user, submissions);
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

const createRewards = async (user: User, submissions: SubmissionWithAppData[]): Promise<SubmissionWithAppData[]> => {
  const missingReward = submissions.filter((s) => s.app.reward === undefined);
  if (missingReward.length === 0) {
    return submissions;
  }

  const contracts = getContracts();
  // multicall that returns all the rewards in format [BigNumber, BigNumber][]
  // where first element is the payment token amount and the second is the reputation token amount
  const m = (await multicall({
    contracts: missingReward.map((s) => {
      return {
        address: contracts.ScalableLikertEnforcement.address,
        abi: contracts.ScalableLikertEnforcement.abi,
        functionName: "getRewards",
        args: [s.laborMarketAddress, BigNumber.from(s.id)],
      };
    }),
  })) as [BigNumber, BigNumber][];

  await prisma.reward.createMany({
    data: missingReward.map((s, index) => {
      const getReward = m[index]!;
      return {
        userId: user.id,
        submissionId: s.id,
        laborMarketAddress: s.laborMarketAddress,
        hasClaimed: false,
        tokenId: s.app.token?.id,
        isIou: s.app.token?.iou ?? false,
        hasReward: getReward[0].gt(0) || getReward[1].gt(0),
        paymentTokenAmount: getReward[0].toString(),
        reputationTokenAmount: getReward[1].toString(),
      };
    }),
  });

  return await getAppData(user, submissions);
};

const updateClaimStatus = async (
  user: User,
  submissions: SubmissionWithAppData[]
): Promise<SubmissionWithAppData[]> => {
  const unclaimedRewards = submissions.filter((s) => s.app.reward?.hasClaimed === false);
  if (unclaimedRewards.length === 0) {
    return submissions;
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

  return await getAppData(user, submissions);
};

const synchronizeRewards = async (
  user: User,
  submissions: SubmissionWithServiceRequest[]
): Promise<SubmissionWithAppData[]> => {
  const withAppData = await getAppData(user, submissions);
  const withRewards = await createRewards(user, withAppData);
  const withUpdatedClaimStatus = await updateClaimStatus(user, withRewards);
  const withTreasuryData = await updateTreasuryClaimStatus(user, withUpdatedClaimStatus);

  return withTreasuryData;
};

export const getRewards = async (user: User, search: RewardsSearch) => {
  const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as EvmAddress });
  return await synchronizeRewards(user, submissions);
};
