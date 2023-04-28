import type { Token, User, Wallet } from "@prisma/client";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { z } from "zod";
import { mongo } from "~/services/mongo.server";
import { listTokens } from "~/services/tokens.server";
import { fetchSignatures, fetchClaims } from "~/services/treasury.server";
import { findAllWalletsForUser } from "~/services/wallet.server";
import { getContracts } from "~/utils/contracts.server";
import { utcDate } from "~/utils/date";
import { displayBalance, fromTokenAmount } from "~/utils/helpers";
import type { SubmissionDoc, SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { RewardsSearch } from "./schema";

type AppMeta = {
  token?: Token;
  wallet?: Wallet;
};

type ChainMeta = {
  hasReward: boolean;
  paymentTokenAmount: string;
  displayPaymentTokenAmount: string;
  reputationTokenAmount: string;
  displayReputationTokenAmount: string;
};

type TreasuryMeta = {
  signature?: string; // the signature from Treasury API if an IOU token
  hasRedeemed?: boolean; // if an IOU token, whether the user has redeemed it
};

export type RewardWithAppMeta = Pick<Reward, "submission" | "app">;
export type RewardWithChainMeta = Pick<Reward, "submission" | "app" | "chain">;
export type Reward = {
  submission: SubmissionWithServiceRequest;
  app: AppMeta;
  chain: ChainMeta;
  treasury?: TreasuryMeta;
};

const appMetadata = async (user: User, submissions: SubmissionWithServiceRequest[]): Promise<RewardWithAppMeta[]> => {
  const wallets = await findAllWalletsForUser(user.id);
  const tokens = await listTokens();
  return submissions.map((s) => {
    const token = tokens.find((t) => t.contractAddress === s.sr.configuration.pToken);
    const wallet = wallets.find((w) => w.networkName === token?.networkName);
    return {
      submission: s,
      app: {
        token,
        wallet,
      },
    };
  });
};

const treasuryMetadata = async (rewards: RewardWithChainMeta[]): Promise<Reward[]> => {
  // TODO: iou filter
  const iouRewards = rewards.filter((r) => r.app.token?.iou === true);
  if (iouRewards.length > 0) {
    const t: Reward[] = [];
    const signatures = await fetchSignatures(iouRewards);
    for (const reward of rewards) {
      // TODO: iou filter
      if (reward.app.token?.iou) {
        const signature = signatures.find(
          (c) =>
            c.signedBody.marketplaceAddress === reward.submission.laborMarketAddress &&
            c.signedBody.submissionID === Number(reward.submission.id)
        );
        const redeemed = await hasRedeemed(reward.submission);
        t.push({
          ...reward,
          treasury: {
            signature: signature?.signature,
            hasRedeemed: redeemed,
          },
        });
      } else {
        t.push(reward);
      }
    }
    return t;
  }

  return rewards;
};

const searchUserSubmissions = async (params: RewardsSearch): Promise<SubmissionWithServiceRequest[]> => {
  const submissionsDocs = await mongo.submissions
    .aggregate([
      {
        $match: {
          $and: [
            params.serviceProvider ? { "configuration.serviceProvider": params.serviceProvider } : {},
            // params.q ? { $text: { $search: params.q, $language: "english" } } : {},
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
    ])
    .sort({ [params.sortBy]: params.order === "asc" ? 1 : -1 })
    .skip(params.first * (params.page - 1))
    .limit(params.first)
    .toArray();

  return z.array(SubmissionWithServiceRequestSchema).parse(submissionsDocs);
};

const contractMetadata = async (rewards: RewardWithAppMeta[]): Promise<RewardWithChainMeta[]> => {
  const contracts = getContracts();
  // mutlical that returns all the rewards in format [BigNumber, BigNumber][]
  // where first element is the payment token amount and the second is the reputation token amount
  const m = (await multicall({
    contracts: rewards.map((r) => {
      return {
        address: contracts.ScalableLikertEnforcement.address,
        abi: contracts.ScalableLikertEnforcement.abi,
        functionName: "getRewards",
        args: [r.submission.laborMarketAddress, BigNumber.from(r.submission.id)],
      };
    }),
  })) as [BigNumber, BigNumber][];
  return m.map((data, index) => {
    const paymentTokenAmount = data[0].toString();
    const reputationTokenAmount = data[1];
    const reward = rewards[index]!;
    // TODO: remove these display amounts
    return {
      ...reward,
      chain: {
        hasReward: data[0].gt(0) || data[1].gt(0),
        paymentTokenAmount,
        displayPaymentTokenAmount: fromTokenAmount(paymentTokenAmount, reward.app.token?.decimals ?? 18, 2),
        reputationTokenAmount: reputationTokenAmount.toString(),
        displayReputationTokenAmount: displayBalance(reputationTokenAmount),
      },
    };
  });
};

const hasRedeemed = async (submission: SubmissionDoc) => {
  const res = await fetchClaims(submission);
  if (res.claims.ok) {
    const redeemClaim = res.claims.val.find((c) => c.redeemTx !== null);
    return !!redeemClaim;
  }
  return undefined;
};

export const getRewards = async (user: User, search: RewardsSearch): Promise<Reward[]> => {
  const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as `0x${string}` });

  const withAppMeta = await appMetadata(user, submissions);
  const withChainMeta = await contractMetadata(withAppMeta);
  return await treasuryMetadata(withChainMeta);
};
