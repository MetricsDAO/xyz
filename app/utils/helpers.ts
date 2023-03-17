import type { Project, Token } from "@prisma/client";
import { BigNumber, ethers } from "ethers";
import type { LaborMarket } from "~/domain/labor-market/schemas";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { claimDate } from "./date";

export const truncateAddress = (address: string) => {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const DECIMALS = 18;

/**
 * Take a string representation of an amount (to allow for really small or big numbers) and convert to BigNumber
 * @param amount string amount
 * @returns {BigNumber}
 */
export const toTokenAmount = (amount: string) => {
  return ethers.utils.parseUnits(amount, DECIMALS);
};

/**
 * Convert units to a decimal representation
 * A unit of 1 represents the smallest denomination. 1 USDC = 1000000 units. This will convert to fraction for display => 0.000001
 * @param units string units
 * @param round string decimals
 * @returns {string}
 */
export const fromTokenAmount = (units: string, roundDecimals?: number) => {
  const fixed = ethers.FixedNumber.fromValue(BigNumber.from(units), DECIMALS);
  if (roundDecimals) {
    return fixed.round(roundDecimals).toString();
  }
  return fixed.toString();
};

export function findProjectsBySlug(projects: Project[], slugs: string[]) {
  return slugs
    .map((slug) => {
      return projects.find((p) => p.slug === slug);
    })
    .filter((p): p is Project => !!p);
}

/**
 * Take a contract address and return the corresponing token abbreviation
 * @param address Contract address of the token
 * @param tokens List of tokens in the app
 * @returns {string}
 */
export const toTokenAbbreviation = (address: string, tokens: Token[]) => {
  return tokens.find((t) => t.contractAddress === address)?.symbol;
};

/**
 * Take a contract address and return the corresponing network name
 * @param address Contract address of the token
 * @param tokens List of tokens in the app
 * @returns {string}
 */
export const toNetworkName = (address: string, tokens: Token[]) => {
  return tokens.find((t) => t.contractAddress === address)?.networkName;
};

export function claimToReviewDeadline(serviceRequest: ServiceRequestWithIndexData) {
  return claimDate(serviceRequest.createdAtBlockTimestamp, serviceRequest.configuration.enforcementExp);
}

/**
 * Display a BigNumber balance as a locale string if possible. Otherwise as an unformatted string.
 * @param {BigNumber} balance
 * @returns {string} locale string representation of the balance
 */
export function displayBalance(balance: BigNumber): string {
  try {
    return balance.toNumber().toLocaleString();
  } catch {
    // exceptional for numbers to fall outside the range of Number.MAX_SAFE_INTEGER.
    // Instead of checking in advance with something like balance.lte(Number.MAX_SAFE_INTEGER), use try/catch
    return balance.toString();
  }
}

export function isUnlimitedSubmitRepMax(laborMarket: LaborMarket) {
  return ethers.constants.MaxUint256.eq(laborMarket.configuration.reputationParams.submitMax);
}
