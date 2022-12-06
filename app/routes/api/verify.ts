import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { unprocessableEntity } from "remix-utils";
import { SiweMessage } from "siwe";
import { createUserSession, getNonce } from "~/services/session.server";
import { createUser, findUserByAddress } from "~/services/user.server";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  const { message, signature } = await data.request.json();
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);

  const nonce = await getNonce(data.request);
  if (fields.nonce !== nonce) {
    return unprocessableEntity({ message: "Invalid nonce" });
  }

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
