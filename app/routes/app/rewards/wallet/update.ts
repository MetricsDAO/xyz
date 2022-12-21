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

  if (user) await updateWalletAddress(user, formData.data);

  return redirect("/app/rewards/addresses");
};
