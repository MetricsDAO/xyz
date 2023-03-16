import { ethers } from "ethers";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";

export const EvmAddressSchema = z
  .string()
  .refine((address) => {
    return ethers.utils.isAddress(address);
  }, "Must be a valid EVM address.")
  .transform((address) => ethers.utils.getAddress(address).toLowerCase());

export type EvmAddress = z.infer<typeof EvmAddressSchema>;

export const SolAddressSchema = z.string().refine((address): address is `0x${string}` => {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBuffer());
  } catch (e) {
    return false;
  }
}, "Must be a valid Solana address.");

// TODO: Add other address types
