import * as ProdContracts from "labor-markets-abi";
import * as DevContracts from "labor-markets-abi-dev";

export function getContracts(isProd?: boolean) {
  return isProd ? ProdContracts : DevContracts;
}
