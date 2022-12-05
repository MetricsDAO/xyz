import { useFetcher } from "@remix-run/react";
import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { SiweMessage } from "siwe";
import { createNonceSession, createUserSession, getNonce } from "~/services/session.server";
import { createUser, findUserByAddress } from "~/services/user.server";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  const { message, signature } = await data.request.json();
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);

  //TODO: compare session nonce with fields.nonce and return false if not equal
  //how to add nonce to session?

  //   if (fields.nonce !== nonceFromSession) {
  //     return json({ ok: false });
  //   }

  const userAddress = message.address;

  let user = await findUserByAddress(userAddress);
  if (!user) {
    user = await createUser(userAddress);
  }

  await createUserSession({
    request: data.request,
    userId: user.id,
  });

  return json({ ok: true });
};

export async function loader() {
  redirect("/");
}
