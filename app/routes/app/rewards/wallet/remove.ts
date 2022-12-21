import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { deleteWalletValidator } from "~/routes/app/rewards/addresses";
import { deleteWalletAddress } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  const formData = await deleteWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  await deleteWalletAddress(formData.data);

  return redirect("/app/rewards/addresses");
};
