import { z } from "zod";
import { mongo } from "~/services/mongo.server";
import { utcDate } from "~/utils/date";
import type { SubmissionWithReward, SubmissionWithServiceRequest } from "../submission/schemas";
import { SubmissionWithServiceRequestSchema } from "../submission/schemas";
import type { RewardsSearch } from "./schema";
import { synchronizeSubmissionRewards } from "./synchronize.server";

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

export const searchSubmissionsWithRewards = async (search: RewardsSearch) => {
  const submissions = await searchUserSubmissions(search);
  await synchronizeSubmissionRewards(submissions);
  const updatedSubmissions = await searchUserSubmissions(search);
  return updatedSubmissions as SubmissionWithReward[]; //TODO parse with Zod
};
