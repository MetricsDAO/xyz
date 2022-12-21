import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { addWalletValidator } from "~/routes/app/rewards/addresses";
import { getUserId } from "~/services/session.server";
import { addWalletAddress, findNetworkOfWallet } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  const user = await getUserId(request);

  const formData = await addWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  const networkName = formData.data.payment.networkName;
  const address = formData.data.payment.address;
  const network = await findNetworkOfWallet(networkName);

  if (network && user) {
    await addWalletAddress(address, network.name, user);
  }

  return redirect("/app/rewards/addresses");
};
