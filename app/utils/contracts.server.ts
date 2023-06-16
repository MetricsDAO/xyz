import * as ProdContracts from "labor-markets-abi";
import env from "~/env.server";

export function getContracts() {
  const isDev = env.ENVIRONMENT === "development";
  return contractsByEnv(isDev);
}

export function contractsByEnv(isDev?: boolean) {
  return ProdContracts;
}
