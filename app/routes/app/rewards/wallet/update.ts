import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { updateWalletValidator } from "~/routes/app/rewards/addresses";
import { getUserId } from "~/services/session.server";
import { updateWalletAddress } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  const user = await getUserId(request);

  const formData = await updateWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  const address = formData.data.currentAddress;
  const newAddress = formData.data.payment.address;
  const networkName = formData.data.payment.networkName;

  if (user) await updateWalletAddress(user, address, newAddress, networkName);

  return redirect("/app/rewards/addresses");
};
