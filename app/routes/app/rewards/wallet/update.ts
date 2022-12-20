import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { updateWalletValidator } from "~/routes/app/rewards/addresses";
import { updateWalletAddress } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  const formData = await updateWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  const user = formData.data.userId;
  const address = formData.data.currentAddress;
  const newAddress = formData.data.newAddress;

  await updateWalletAddress(user, address, newAddress);

  return redirect("/app/rewards/addresses");
};
