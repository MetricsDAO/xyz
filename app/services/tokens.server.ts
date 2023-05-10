import { findTokensBySymbolHelper } from "~/utils/helpers";
import { prisma } from "./prisma.server";

export const listTokens = () => {
  return prisma.token.findMany();
};

/**
 * Find token by symbol
 * @param symbols array
 * @returns {Promise<Token>}
 */
export const findTokenBySymbol = async (symbols: string[]) => {
  const allTokens = await listTokens();
  return findTokensBySymbolHelper(allTokens, symbols);
};
