import { ethers } from "ethers";
import { z } from "zod";

export const ethereumSchema = z.string().refine((address) => {
  return ethers.utils.isAddress(address);
});

// TODO: Add other address types
