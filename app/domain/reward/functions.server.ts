import type { Token, User, Wallet } from "@prisma/client";
import { multicall } from "@wagmi/core";
import { BigNumber } from "ethers";
import { z } from "zod";
import { mongo } from "~/services/mongo.server";
import { fetchSignedClaims } from "~/services/treasury.server";
import { getContracts } from "~/utils/contracts.server";
import { utcDate } from "~/utils/date";
import { displayBalance, fromTokenAmount } from "~/utils/helpers";
import type { SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { RewardsSearch } from "./schema";

export type Reward = {
  submission: SubmissionWithServiceRequest;
  token?: Token;
  wallet?: Wallet;
  signature?: string; // the signature from Treasury API if an IOU token
  hasReward: boolean;
  amounts: {
    paymentTokenAmount: string;
    displayPaymentTokenAmount: string;
    reputationTokenAmount: string;
    displayReputationTokenAmount: string;
  };
};

export const getRewards = async (
  user: User,
  search: RewardsSearch,
  tokens: Token[],
  wallets: Wallet[]
): Promise<Reward[]> => {
  const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as `0x${string}` });

  const rpcRewards = await getRewardsMulticall(submissions);

  const rewards = rpcRewards.map((r) => {
    const { submission, hasReward, paymentTokenAmount, reputationTokenAmount } = r;
    const token = tokens.find((t) => t.contractAddress === submission.sr.configuration.pToken);
    const wallet = wallets.find((w) => w.networkName === token?.networkName);
    return {
      submission,
      token,
      wallet,
      hasReward,
      amounts: {
        paymentTokenAmount: paymentTokenAmount.toString(),
        displayPaymentTokenAmount: fromTokenAmount(paymentTokenAmount.toString(), token?.decimals ?? 18, 2),
        reputationTokenAmount: reputationTokenAmount.toString(),
        displayReputationTokenAmount: displayBalance(reputationTokenAmount),
      },
    };
  });

  // TODO: filter IOU tokens
  const iouRewards = rewards.filter((r) => r.token?.contractAddress === "0xdfE107Ad982939e91eaeBaC5DC49da3A2322863D");
  if (iouRewards.length > 0) {
    const signedClaims = await fetchSignedClaims(iouRewards);
    if (signedClaims.length > 0) {
      const rewardsWithSignature = rewards.map((s) => {
        const signedClaim = signedClaims.find(
          (c) =>
            c.signedBody.marketplaceAddress === s.submission.laborMarketAddress &&
            c.signedBody.submissionID === Number(s.submission.id)
        );
        return {
          ...s,
          signature: signedClaim?.signature,
        };
      });
      return rewardsWithSignature;
    }
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

export const getRewardsMulticall = async (submissions: SubmissionWithServiceRequest[]) => {
  const contracts = getContracts();
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
  return m.map((data, index) => {
    return {
      paymentTokenAmount: data[0],
      reputationTokenAmount: data[1],
      hasReward: data[0].gt(0) || data[1].gt(0),
      submission: submissions[index]!,
    };
  });
};
