import { MongoClient } from "mongodb";
import type { SubmissionDoc, ReviewDoc } from "~/domain";
import type { ServiceRequestDoc, ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import type { LaborMarketWithIndexData } from "~/domain/labor-market/schemas";
import env from "~/env.server";

const client = new MongoClient(env.MONGODB_URI);

// Since every index is a deterministic history, we can have each subscriber have its own database.
// This is useful for deploying changes to the index and having it recreate from scratch.
const db = client.db(env.PINE_SUBSCRIBER);

const laborMarkets = db.collection<LaborMarketWithIndexData>("laborMarkets");
const serviceRequests = db.collection<ServiceRequestWithIndexData>("serviceRequests");
const submissions = db.collection<SubmissionDoc>("submissions");
const reviews = db.collection<ReviewDoc>("reviews");

laborMarkets.createIndex({ "appData.title": "text" });
serviceRequests.createIndex({ "appData.title": "text" });

export const mongo = {
  db,
  laborMarkets,
  serviceRequests,
  submissions,
  reviews,
};
