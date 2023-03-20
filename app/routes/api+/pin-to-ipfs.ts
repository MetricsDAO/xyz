import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { uploadJsonToIpfs } from "~/services/ipfs.server";
import { requireUser } from "~/services/session.server";

export async function action({ request }: DataFunctionArgs) {
  const user = await requireUser(request, "/app");
  const payload = await request.json();
  const cid = await uploadJsonToIpfs(user, payload);
  return { cid };
}
