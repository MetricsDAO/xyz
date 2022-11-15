import { ethers } from "ethers";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";

export const EthAddressSchema = z.string().refine((address) => {
  return ethers.utils.isAddress(address);
}, "Must be a valid Ethereum address.");

export const SolAddressSchema = z.string().refine((address) => {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBuffer());
  } catch (e) {
    return false;
  }
}, "Must be a valid Solana address.");

// TODO: Add other address types
