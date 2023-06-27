import type { DataFunctionArgs } from "@remix-run/server-runtime";
// import { z } from "zod";

// const paramSchema = z.object({ id: z.string() });
export async function action({ request, params }: DataFunctionArgs) {
  // TODO
  // const user = await requireUser(request);
  // const { id } = getParamsOrFail(params, paramSchema);
  // const reward = await prisma.reward.findFirst({
  //   where: {
  //     id: id,
  //   },
  // });
  // if (!reward) {
  //   throw notFound("Reward not found");
  // }
  // if (reward.userId !== user.id) {
  //   throw forbidden("You do not have permission to mark this reward as redeemed");
  // }
  // return await prisma.reward.update({
  //   where: {
  //     id: id,
  //   },
  //   data: {
  //     iouClientTransactionSuccess: true,
  //   },
  // });
}
