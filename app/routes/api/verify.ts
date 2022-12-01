import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { SiweMessage } from "siwe";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  const { message, signature } = await data.request.json();
  console.log("message", message);
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);
  return fields;
};
