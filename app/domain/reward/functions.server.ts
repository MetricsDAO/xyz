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
import type { SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { FetchClaimsResponse, FetchSignaturesResponse } from "../treasury";
import type { RewardsSearch } from "./schema";
import { findAllRewardsForUser } from "~/services/reward.server";
import { prisma } from "~/services/prisma.server";
import { ACTIONS } from "~/hooks/use-has-performed";

type AppData = {
  wallet?: Wallet;
  reward?: Reward;
  token?: Token;
};

export type SubmissionWithAppData = {
  submission: SubmissionWithServiceRequest;
  app: AppData;
};

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
      submission: s,
      app: {
        wallet,
        reward,
        token,
      },
    };
  });
};

// const treasuryMetadata = async (rewards: RewardWithChainMeta[]): Promise<Reward[]> => {
//   const iouRewards = rewards.filter((r) => r.app.token?.iou === true);
//   if (iouRewards.length > 0) {
//     const t: Reward[] = [];
//     const signatures = await fetchSignatures(iouRewards);
//     const claims = await fetchClaims(iouRewards);

//     for (const reward of rewards) {
//       if (reward.app.token?.iou) {
//         const signature = getSignature(signatures, reward);
//         const redeemed = hasRedeemed(claims, reward);
//         t.push({
//           ...reward,
//           treasury: {
//             signature: signature?.signature,
//             hasRedeemed: redeemed,
//           },
//         });
//       } else {
//         t.push(reward);
//       }
//     }
//     return t;
//   }

//   return rewards;
// };

// const getSignature = (signatures: FetchSignaturesResponse, reward: RewardWithChainMeta) => {
//   return signatures.find(
//     (c) =>
//       c.signedBody.marketplaceAddress === reward.submission.laborMarketAddress &&
//       c.signedBody.submissionID === Number(reward.submission.id)
//   );
// };

// const hasRedeemed = (claims: FetchClaimsResponse[], reward: RewardWithChainMeta) => {
//   const redemptedClaim = claims.find((c) => {
//     return c.claims.val.find(
//       (v) =>
//         v.marketplaceAddress === reward.submission.laborMarketAddress &&
//         v.submissionID === Number(reward.submission.id) &&
//         v.redeemTx !== null
//     );
//   });

//   return !!redemptedClaim;
// };

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

const createRewards = async (user: User, submissions: SubmissionWithAppData[]) => {
  const contracts = getContracts();
  // multicall that returns all the rewards in format [BigNumber, BigNumber][]
  // where first element is the payment token amount and the second is the reputation token amount
  const m1 = (await multicall({
    contracts: submissions.map((s) => {
      return {
        address: contracts.ScalableLikertEnforcement.address,
        abi: contracts.ScalableLikertEnforcement.abi,
        functionName: "getRewards",
        args: [s.submission.laborMarketAddress, BigNumber.from(s.submission.id)],
      };
    }),
  })) as [BigNumber, BigNumber][];
  console.log("m1", m1);

  const m2 = (await multicall({
    contracts: submissions.map((s) => {
      return {
        address: s.submission.laborMarketAddress,
        abi: contracts.LaborMarket.abi,
        functionName: "hasPerformed",
        args: [BigNumber.from(s.submission.id), user.address as `0x${string}`, ACTIONS.HAS_CLAIMED],
      };
    }),
  })) as boolean[];

  console.log("m2", m2);

  await prisma.reward.createMany({
    data: submissions.map((s, index) => {
      const getReward = m1[index]!;
      const hasClaimed = m2[index]!;
      return {
        userId: user.id,
        submissionId: s.submission.id,
        laborMarketAddress: s.submission.laborMarketAddress,
        hasClaimed,
        tokenId: s.app.token?.id,
        isIou: s.app.token?.iou ?? false,
        hasReward: getReward[0].gt(0) || getReward[1].gt(0),
        paymentTokenAmount: getReward[0].toString(),
        reputationTokenAmount: getReward[1].toString(),
      };
    }),
  });

  // for (const [index, data] of m.entries()) {
  //   const data = m[index];
  //   prisma.reward.createMany({
  //     data: {
  //   })

  // }
};

export const getRewards = async (user: User, search: RewardsSearch) => {
  const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as `0x${string}` });
  const withAppData = await getAppData(user, submissions);
  const missingReward = withAppData.filter((s) => !s.app.reward);
  await createRewards(user, missingReward);
};

// export const getRewards2 = async (user: User, search: RewardsSearch): Promise<SubmissionWithAppData[]> => {
//   const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as `0x${string}` });
//   const withAppData = await getAppData(user, submissions);
//   const missingReward = withAppData.filter((s) => !s.app.reward);
//   await createRewards(missingReward);
// };
