import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { unprocessableEntity } from "remix-utils";
import { SiweMessage } from "siwe";
import { createUserSession, getNonce } from "~/services/session.server";
import { createUser, findUserByAddress } from "~/services/user.server";
import chainalysisAbi from "~/abi/chainalysis.json";
import { ethers } from "ethers";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  const { message, signature } = await data.request.json();
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);

  if (await isAddressSanctioned(message.address)) {
    return unprocessableEntity({ message: "Sanctioned Address" });
  }
  const nonce = await getNonce(data.request);
  if (fields.nonce !== nonce) {
    return unprocessableEntity({ message: "Invalid nonce" });
  }

  const userAddress = message.address;
  let user = await findUserByAddress(userAddress);
  if (!user) {
    user = await createUser(userAddress);
  }

  return createUserSession({
    request: data.request,
    userId: user.id,
  });
};

/**
 * Check if a wallet address is sanctioned.
 *
 * @param {string} address - The wallet address in question.
 * @returns {Promise<boolean>} - True if the address is sanctioned, false otherwise.
 */
async function isAddressSanctioned(address: string): Promise<boolean> {
  const provider = ethers.providers.getDefaultProvider();
  const contract_address = "0x40c57923924b5c5c5455c48d93317139addac8fb";
  const contract = new ethers.Contract(contract_address, chainalysisAbi.abi, provider);
  const isSanctioned = await contract.isSanctioned(address);
  return isSanctioned;
}
