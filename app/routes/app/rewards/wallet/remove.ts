import type { ActionFunction, ActionFunctionArgs } from "@remix-run/server-runtime/dist/router";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { deleteWalletValidator } from "~/routes/app/rewards/addresses";
import { deleteWalletAddress } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await deleteWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  console.log("formData", formData);

  const address = formData.data.currentAddress;

  await deleteWalletAddress(address);

  return redirect("/app/rewards/addresses");
};
