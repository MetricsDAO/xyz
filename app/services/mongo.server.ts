import { MongoClient } from "mongodb";
import type { ActivityDoc, ReviewDoc } from "~/domain";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import env from "~/env.server";
import type { SubmissionDoc } from "~/domain/submission/schemas";
import { pineConfig } from "~/utils/pine-config.server";

const options = {};

const uri = env.MONGODB_URI;

let client;
let clientPromise: Promise<MongoClient>;

if (env.ENVIRONMENT === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const mongoPromise = (async () => {
  // Since every index is a deterministic history, we can have each subscriber have its own database.
  // This is useful for deploying changes to the index and having it recreate from scratch.
  const pine = pineConfig();
  const db = (await clientPromise).db(`${pine.namespace}-${pine.subscriber}`);

  const laborMarkets = db.collection<LaborMarketWithIndexData>("laborMarkets");
  const serviceRequests = db.collection<ServiceRequestWithIndexData>("serviceRequests");
  const submissions = db.collection<SubmissionDoc>("submissions");
  const reviews = db.collection<ReviewDoc>("reviews");
  const userActivity = db.collection<ActivityDoc>("userActivity");

  laborMarkets.createIndex({ "appData.title": "text" });
  serviceRequests.createIndex({ "appData.title": "text" });
  userActivity.createIndex({ laborMarketTitle: "text" });
  submissions.createIndex({ "appData.title": "text" });
  return {
    db,
    laborMarkets,
    serviceRequests,
    submissions,
    reviews,
    userActivity,
  };
})();
