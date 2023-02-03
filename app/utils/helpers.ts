import type { Project } from "@prisma/client";
import { ethers } from "ethers";

export const truncateAddress = (address: string) => {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Standardized way of parsing token string amount. An amount of 1 is 1e18 units.
 * @param amount string amount that cannot be less than 1e-18
 * @returns {BigNumber}
 */
export const parseTokenAmount = (amount: string) => {
  // MVP: only support 6 decimals for USDC
  return ethers.utils.parseUnits(amount, 6);
};

/**
 * Removes leading zeros from an address 0x0000000000000000000000003592fd4c9e9b4b1286d4e2b400b5386a2429cca1 => 0x3592fd4C9E9B4b1286d4E2b400B5386A2429CCa1
 * @param str
 */
export function removeLeadingZeros(str: string): string {
  return ethers.utils.hexStripZeros(str);
}

export function findProjectsBySlug(projects: Project[], slugs: string[]) {
  return slugs
    .map((slug) => {
      return projects.find((p) => p.slug === slug);
    })
    .filter((p): p is Project => !!p);
}
