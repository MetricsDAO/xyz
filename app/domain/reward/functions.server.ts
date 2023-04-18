import type { Token, User, Wallet } from "@prisma/client";
import { z } from "zod";
import { mongo } from "~/services/mongo.server";
import { fetchSignedClaims } from "~/services/treasury.server";
import { utcDate } from "~/utils/date";
import type { SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { RewardsSearch } from "./schema";

export type Reward = {
  submission: SubmissionWithServiceRequest;
  token?: Token;
  wallet?: Wallet;
  signature?: string; // the signature from Treasury API if an IOU token
};

export const getRewards = async (
  user: User,
  search: RewardsSearch,
  tokens: Token[],
  wallets: Wallet[]
): Promise<Reward[]> => {
  const submissions = await searchUserSubmissions({ ...search, serviceProvider: user.address as `0x${string}` });

  const rewards = submissions.map((submission) => {
    const token = tokens.find((t) => t.contractAddress === submission.sr.configuration.pToken);
    const wallet = wallets.find((w) => w.networkName === token?.networkName);
    return { submission, token, wallet };
  });
  console.log("rewards", rewards);

  // TODO: filter IOU tokens
  const iouRewards = rewards.filter((r) => r.token?.contractAddress === "0xdfE107Ad982939e91eaeBaC5DC49da3A2322863D");
  if (iouRewards.length > 0) {
    const signedClaims = await fetchSignedClaims(iouRewards);
    console.log("signedClaims", signedClaims);
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
