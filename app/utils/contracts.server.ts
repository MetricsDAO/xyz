import * as ProdContracts from "labor-markets-abi";
import * as DevContracts from "labor-markets-abi-dev";
import env from "~/env.server";

export function getContracts() {
  const isProd = env.ENVIRONMENT === "production" || env.ENVIRONMENT === "staging";
  return contractsByEnv(isProd);
}

export function contractsByEnv(isProd?: boolean) {
  return isProd ? ProdContracts : DevContracts;
}
