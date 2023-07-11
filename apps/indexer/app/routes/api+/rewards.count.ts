import type { DataFunctionArgs } from "@remix-run/server-runtime";
// import { prisma } from "~/services/prisma.server";
// import { requireUser } from "~/services/session.server";

export async function loader({ request }: DataFunctionArgs) {
  // TODO: count rewards
  // const user = await requireUser(request);

  return null;
}
