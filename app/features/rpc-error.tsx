import type { EthersError } from "./web3-button/types";

export function RPCError({ error }: { error: EthersError }) {
  return <p className="text-red-500">{error.reason ?? "Something went wrong"}</p>;
}
