import { MongoClient } from "mongodb";
import type { ActivityDoc, ReviewDoc } from "~/domain";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import env from "~/env.server";
import type { SubmissionDoc } from "~/domain/submission/schemas";
import { pineConfig } from "~/utils/pine-config.server";

// const client = new MongoClient(env.MONGODB_URI, {
//   connectTimeoutMS: 60000, // set timeout to 60 seconds
//   maxPoolSize: 200, // set the maximum number of connections in the pool
//   socketTimeoutMS: 60000, // close sockets after 60 seconds of inactivity
// });

// try {
//   client.connect();
// } catch (e) {
//   console.error(e);
// }

type CachedMongoClient = MongoClient | null;

let cachedClient: CachedMongoClient = null;

const client = new MongoClient(env.MONGODB_URI, {
  connectTimeoutMS: 60000, // set timeout to 60 seconds
  maxPoolSize: 200, // set the maximum number of connections in the pool
});

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = await client.connect();
  return cachedClient;
}

// Since every index is a deterministic history, we can have each subscriber have its own database.
// This is useful for deploying changes to the index and having it recreate from scratch.
const pine = pineConfig();
const db = client.db(`${pine.namespace}-${pine.subscriber}`);

const laborMarkets = db.collection<LaborMarketWithIndexData>("laborMarkets");
const serviceRequests = db.collection<ServiceRequestWithIndexData>("serviceRequests");
const submissions = db.collection<SubmissionDoc>("submissions");
const reviews = db.collection<ReviewDoc>("reviews");
const userActivity = db.collection<ActivityDoc>("userActivity");

laborMarkets.createIndex({ "appData.title": "text" });
serviceRequests.createIndex({ "appData.title": "text" });
userActivity.createIndex({ laborMarketTitle: "text" });
submissions.createIndex({ "appData.title": "text" });

export const mongo = {
  db,
  laborMarkets,
  serviceRequests,
  submissions,
  reviews,
  userActivity,
};
