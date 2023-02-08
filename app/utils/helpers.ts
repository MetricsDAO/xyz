import type { Project } from "@prisma/client";
import { BigNumber } from "ethers";
import { ethers } from "ethers";

export const truncateAddress = (address: string) => {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// MVP: only support 6 decimals for USDC
const DECIMALS = 6;

/**
 * Standardized way of parsing token string amount
 * @param amount string amount
 * @returns {BigNumber}
 */
export const parseTokenAmount = (amount: string) => {
  return ethers.utils.parseUnits(amount, DECIMALS);
};

/**
 * Convert smallest denomination of a string number to a fractional amount.
 * A unit of 1 represents the smallest denomination. 1 USDC = 1000000 units. This will convert to fraction for display.
 * @param amount BigNumber amount in smallest denomination
 * @returns {string}
 */
export const fromTokenAmount = (amount: string) => {
  return ethers.FixedNumber.fromValue(BigNumber.from(amount), DECIMALS).toString();
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
