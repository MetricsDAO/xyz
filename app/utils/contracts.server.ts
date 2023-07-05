import * as ProdContracts from "labor-markets-abi";
import * as DevContracts from "labor-markets-abi-dev";
import env from "~/env.server";

export function getContracts() {
  const isDev = env.ENVIRONMENT === "development";
  return contractsByEnv(isDev);
}

export function contractsByEnv(isDev?: boolean) {
  return isDev ? DevContracts : ProdContracts;
}
