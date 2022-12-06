import type { ActionFunction, DataFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { unprocessableEntity } from "remix-utils";
import { SiweMessage } from "siwe";
import { createUserSession, getNonce } from "~/services/session.server";
import { createUser, findUserByAddress } from "~/services/user.server";
import chainalysisAbi from "~/abi/chainalysis.json";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";

const RPC_URL = "https://mainnet.infura.io/v3/54fcc811bac44f99b84a04a4a3e2f998";

export const action: ActionFunction = async (data: DataFunctionArgs) => {
  const { message, signature } = await data.request.json();
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.validate(signature);

  //Chainalysis gating through web3.js to check if an address is sanctioned
  const web3 = new Web3(RPC_URL);
  const contract_address = "0x40c57923924b5c5c5455c48d93317139addac8fb";
  const contract = new web3.eth.Contract(chainalysisAbi.abi as AbiItem[], contract_address);
  const isSanctioned = await contract.methods.isSanctioned(message.address).call();

  if (isSanctioned) {
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

  await createUserSession({
    request: data.request,
    userId: user.id,
  });

  return json({ ok: true });
};
