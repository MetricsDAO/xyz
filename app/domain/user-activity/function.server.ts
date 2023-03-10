import { z } from "zod";
import { zfd } from "zod-form-data";
import { mongo } from "~/services/mongo.server";
import type { ActivityFilter, ActivitySearch } from "./schemas";

/**
 * Counts the number of LaborMarkets that match a given LaborMarketSearch.
 */
export function countUserActivity(filter: ActivityFilter) {
  return mongo.userActivity.countDocuments(filterToMongo(filter));
}

/**
 * Returns an array of LaborMarketsWithIndexData for a given LaborMarketSearch.
 */
export function searchUserActivity(userAddress: string, search: ActivitySearch) {
  return mongo.userActivity
    .find({ userAddress, ...filterToMongo(search) })
    .sort({ [search.sortBy]: search.order === "asc" ? 1 : -1 })
    .skip(search.first * (search.page - 1))
    .limit(search.first)
    .toArray();
}

/**
 * Convenience function to share the search parameters between search and count.
 * @returns criteria to find labor market in MongoDb
 */
function filterToMongo(filter: ActivityFilter): Parameters<typeof mongo.userActivity.find>[0] {
  return {
    eventType: filter.eventType,
    ...(filter.q ? { $text: { $search: filter.q, $language: "english" } } : {}),
    ...(filter.eventType ? { eventType: { $in: filter.eventType } } : {}),
  };
}
