import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { prisma } from "~/services/prisma.server";
import { requireUser } from "~/services/session.server";

export async function loader({ request }: DataFunctionArgs) {
  const user = await requireUser(request);

  const rewards = await prisma.reward.findMany({
    where: {
      userId: user.id,
      hasClaimed: false,
    },
  });

  return rewards;
}
