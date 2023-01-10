import { ethers } from "ethers";

export const PROJECT_ICONS: Record<string, string | undefined> = {
  Ethereum: "/img/icons/project-icons/eth.svg",
  Solana: "/img/icons/project-icons/sol.svg",
};

export const TOKEN_ICONS: Record<string, string | undefined> = {
  Algorand: "/img/icons/token-icons/algo.svg",
  Axelar: "/img/icons/token-icons/algo.svg",
  Ethereum: "/img/icons/token-icons/eth.svg",
  Flow: "/img/icons/token-icons/flow.svg",
  Near: "/img/icons/token-icons/near.svg",
  Rune: "/img/icons/token-icons/rune.svg",
  Solana: "/img/icons/token-icons/sol.svg",
  USDC: "/img/icons/token-icons/usdc.svg",
};

export const DEFAULT_SYMBOL: Record<string, string | undefined> = {
  Ethereum: "ETH",
  Solana: "SOL",
};

export const truncateAddress = (address: string) => {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const SCORE_COLOR = {
  Great: "bg-lime-100",
  Good: "bg-blue-200",
  Average: "bg-neutral-200",
  Bad: "bg-orange-200",
  Spam: "bg-rose-200",
};

export const SCORE_COLOR_SECONDARY = {
  Great: "bg-lime-500",
  Good: "bg-blue-400",
  Average: "bg-zinc-500",
  Bad: "bg-amber-500",
  Spam: "bg-rose-400",
};

/**
 * Standardized way of parsing token string amount. An amount of 1 is 1e18 units.
 * @param amount string amount that cannot be less than 1e-18
 * @returns {BigNumber}
 */
export const parseTokenAmount = (amount: string) => {
  return ethers.utils.parseUnits(amount, 18);
};

/**
 * Removes leading zeros from an address 0x0000000000000000000000003592fd4c9e9b4b1286d4e2b400b5386a2429cca1 => 0x3592fd4C9E9B4b1286d4E2b400B5386A2429CCa1
 * @param str
 */
export function removeLeadingZeros(str: string): string {
  return ethers.utils.hexStripZeros(str);
}
