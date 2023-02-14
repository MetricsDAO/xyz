import type { Project, Token } from "@prisma/client";
import { BigNumber, ethers } from "ethers";
import type { LaborMarketDoc, ServiceRequestDoc, SubmissionDoc } from "~/domain";
import { claimDate } from "./date";

export const truncateAddress = (address: string) => {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const DECIMALS = 18;

/**
 * Take a string representation of an amount (to allow for really small or big numbers) and conver to BigNumber
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
 * @returns {string}
 */
export const fromTokenAmount = (units: string) => {
  return ethers.FixedNumber.fromValue(BigNumber.from(units), DECIMALS).toString();
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

/**
 * Take a contract address and return the corresponing token abbreviation
 * @param address Contract address of the token
 * @param tokens List of tokens in the app
 * @returns {string}
 */
export const toTokenAbbreviation = (address: string, tokens: Token[]) => {
  return tokens.find((t) => t.contractAddress === address)?.symbol;
};

export function claimToReviewDeadline(serviceRequest: ServiceRequestDoc) {
  return claimDate(serviceRequest.createdAtBlockTimestamp, serviceRequest.configuration.enforcementExpiration);
}

/**
 * Converts a string score ("4") or number score (4) to a label ("Great")
 * @param score
 * @returns
 */
export function scoreToLabel(score: number | string) {
  if (typeof score === "string") {
    score = scoreToNum(score);
  }
  return score >= 4 ? "Great" : score >= 3 ? "Good" : score >= 2 ? "Average" : score >= 1 ? "Bad" : "Spam";
}

/**
 * Converts a string score ("4") to a number score (4)
 * @param score
 * @returns
 */
export function scoreToNum(score: string) {
  return score === "4" ? 4 : score === "3" ? 3 : score === "2" ? 2 : score === "1" ? 1 : 0;
}

/**
 *  Caclulate the overall score for a submission. The average of all the scores rounded up to the nearest integer.
 * @param {submissionDoc} submission
 * @returns {number} score
 */
export function overallScore(submission: SubmissionDoc): number {
  return Math.round(submission.sumOfReviewScores / submission.reviewCount);
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

export function isUnlimitedSubmitRepMax(laborMarket: LaborMarketDoc) {
  return ethers.constants.MaxUint256.eq(laborMarket.configuration.reputationParams.submitMax);
}
