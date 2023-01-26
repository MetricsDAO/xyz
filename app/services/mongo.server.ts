import { MongoClient } from "mongodb";
import env from "~/env";
import type { LaborMarketDoc } from "./labor-market.server";

const client = new MongoClient(env.MONGODB_URI, { retryWrites: true, writeConcern: { w: "majority" } });
const db = client.db("mdao");

export const mongo = {
  db,
  laborMarkets: db.collection<LaborMarketDoc>("laborMarkets"),
  serviceRequests: db.collection("serviceRequests"),
  submissions: db.collection("submissions"),
};
