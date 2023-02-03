import { MongoClient } from "mongodb";
import type { LaborMarketDoc, ServiceRequestDoc } from "~/domain";
import env from "~/env.server";

const client = new MongoClient(env.MONGODB_URI);
const db = client.db("mdao");

const laborMarkets = db.collection<LaborMarketDoc>("laborMarkets");
const serviceRequests = db.collection<ServiceRequestDoc>("serviceRequests");
const submissions = db.collection("submissions");

laborMarkets.createIndex({ "appData.title": "text" });

export const mongo = {
  db,
  laborMarkets,
  serviceRequests,
  submissions,
};
