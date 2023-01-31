import { MongoClient } from "mongodb";
import type { LaborMarketDoc } from "~/domain";
import env from "~/env.server";
import type { ServiceRequestDoc } from "./service-request.server";

const client = new MongoClient(env.MONGODB_URI);
const db = client.db("mdao");

export const mongo = {
  db,
  laborMarkets: db.collection<LaborMarketDoc>("laborMarkets"),
  serviceRequests: db.collection<ServiceRequestDoc>("serviceRequests"),
  submissions: db.collection("submissions"),
};
