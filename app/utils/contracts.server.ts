import * as ProdContracts from "labor-markets-abi";
import * as DevContracts from "labor-markets-abi-dev";
import env from "~/env.server";

export function getContracts() {
  const isProd = env.ENVIRONMENT === "production" || env.ENVIRONMENT === "staging";
  return contracts(isProd);
}

function contracts(isProd?: boolean) {
  return isProd ? ProdContracts : DevContracts;
}
