import { MongoClient } from "mongodb";
import { ActivityDoc, EventDoc, LaborMarketDoc, ServiceRequestDoc, SubmissionDoc, ReviewDoc } from "@mdao/schema";
import env from "./env";
import { pineConfig } from "./pine-config";

const client = new MongoClient(env.MONGODB_URI, {
  connectTimeoutMS: 60000, // set timeout to 60 seconds
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

const laborMarkets = db.collection<LaborMarketDoc>("laborMarkets");
const serviceRequests = db.collection<ServiceRequestDoc>("serviceRequests");
const submissions = db.collection<SubmissionDoc>("submissions");
const reviews = db.collection<ReviewDoc>("reviews");
const userActivity = db.collection<ActivityDoc>("userActivity");
const events = db.collection<EventDoc>("events");

laborMarkets.createIndex({ "appData.title": "text" });
laborMarkets.createIndex({ address: 1 }, { unique: true });
serviceRequests.createIndex({ "appData.title": "text" });
serviceRequests.createIndex({ laborMarketAddress: 1, id: 1 }, { unique: true });
submissions.createIndex({ "appData.title": "text" });
submissions.createIndex({ laborMarketAddress: 1, serviceRequestId: 1, id: 1 }, { unique: true });
userActivity.createIndex({ laborMarketTitle: "text" });
events.createIndex({ name: 1, address: 1, blockNumber: 1, transactionHash: 1 }, { unique: true });

export const mongo = {
  db,
  laborMarkets,
  serviceRequests,
  submissions,
  reviews,
  userActivity,
  events,
};
