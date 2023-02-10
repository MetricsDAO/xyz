import type { EthersError } from "./web3-button/types";

export function RPCError({ error }: { error: EthersError }) {
  return (
    <div className="space-y-3">
      <p className="text-red-500 font-semibold">Something went wrong in preparing your transaction</p>
      <p className="text-red-500">{error.reason}</p>
    </div>
  );
}
