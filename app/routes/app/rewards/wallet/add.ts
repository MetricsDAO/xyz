import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";
import { validationError } from "remix-validated-form";
import { addWalletValidator } from "~/routes/app/rewards/addresses";
import { getUserId } from "~/services/session.server";
import { addWalletAddress } from "~/services/wallet.server";

export const action: ActionFunction = async ({ request }: DataFunctionArgs) => {
  const user = await getUserId(request);

  const formData = await addWalletValidator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  if (user) await addWalletAddress(user, formData.data);

  return redirect("/app/rewards/addresses");
};
