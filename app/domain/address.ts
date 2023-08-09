import { ethers } from "ethers";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import { bech32 } from "bech32";
import { getIsAddressValid } from "~/utils/fetch";

export const EvmAddressSchema = z
  .string()
  .refine((address) => {
    return ethers.utils.isAddress(address);
  }, "Must be a valid EVM address.")
  .transform((address) => ethers.utils.getAddress(address));

export type EvmAddress = z.infer<typeof EvmAddressSchema>;

export const SolAddressSchema = z.string().refine((address) => {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBuffer());
  } catch (e) {
    return false;
  }
}, "Must be a valid Solana address.");

export const OsmosisAddressSchema = z.string().refine((address) => {
  try {
    const { prefix, words } = bech32.decode(address);
    const result = bech32.encode(prefix, words);
    return result === address && prefix === "osmo";
  } catch {
    return false;
  }
}, "Must be a valid Osmosis address.");

export const NearAddressSchema = z.string().refine(async (address) => {
  try {
    const raw = JSON.stringify({
      method: "query",
      params: {
        request_type: "view_account",
        account_id: address,
        finality: "optimistic",
      },
      id: 123,
      jsonrpc: "2.0",
    });
    const response = await fetch("https://rpc.mainnet.near.org/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    });
    const json = await response.json();
    return json.error ? false : true;
  } catch {
    return false;
  }
}, "Must be a valid NEAR address.");

export const FlowAddressSchema = z.string().refine(async (address) => {
  try {
    const res = await getIsAddressValid(address);
    return res.isValid;
  } catch {
    return false;
  }
}, `Must be a valid FLOW address.`);
