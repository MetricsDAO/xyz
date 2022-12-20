import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { addWalletValidator } from "~/routes/app/rewards/addresses";
import { addWalletAddress, findNetworkOfWallet } from "~/services/wallet.server";
import { getNetworkByTokenSymbol } from "~/utils/helpers";

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  const formData = await addWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  const token = formData.data.payment.tokenSymbol;
  const address = formData.data.payment.address;
  const user = formData.data.userId;
  const network = await findNetworkOfWallet(getNetworkByTokenSymbol(token));

  if (network) {
    await addWalletAddress(address, network.id, user);
  }

  return redirect("/app/rewards/addresses");
};
