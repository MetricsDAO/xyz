import { MongoClient } from "mongodb";
import type { ActivityDoc, ReviewDoc } from "~/domain";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import env from "~/env.server";
import type { SubmissionDoc } from "~/domain/submission/schemas";
import { pineConfig } from "~/utils/pine-config.server";

const client = new MongoClient(env.MONGODB_URI, {
  connectTimeoutMS: 30000, // increase timeout to 30 seconds
  maxPoolSize: 200, // set the maximum number of connections in the pool
});

try {
  client.connect();
} catch (e) {
  console.error(e);
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
