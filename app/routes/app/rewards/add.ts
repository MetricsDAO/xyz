import type { ActionFunction, ActionFunctionArgs } from "@remix-run/server-runtime/dist/router";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { addWalletValidator } from "~/routes/app/rewards/addresses";
import { addWalletAddress, findBlockchainOfWallet } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await addWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  console.log("formData", formData);

  const token = formData.data.payment.tokenSymbol;
  const address = formData.data.payment.address;
  const user = formData.data.userId;
  const payableBlockchain = await findBlockchainOfWallet(token);

  if (payableBlockchain) {
    await addWalletAddress(address, payableBlockchain.id, user);
  }

  return redirect("/app/rewards/addresses");
};
