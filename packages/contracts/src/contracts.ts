import * as ProdContracts from "labor-markets-abi";
import * as DevContracts from "labor-markets-abi-dev";

export function contractsByEnv(isDev?: boolean) {
  return isDev ? DevContracts : ProdContracts;
}
