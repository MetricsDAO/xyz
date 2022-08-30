import { create } from "ipfs-http-client";
import type { DataFunctionArgs } from "@remix-run/node";
export const action = async ({ request }: DataFunctionArgs) => {
  const auth = "Basic " + Buffer.from(process.env.PROJECT_ID + ":" + process.env.PROJECT_SECRET).toString("base64");
  const body = await request.json();
  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const added = await client.add(JSON.stringify(body));
  return {
    path: added.path,
  };
};
