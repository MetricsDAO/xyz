// https://github.com/wagmi-dev/wagmi/discussions/233#discussioncomment-2609115
type EthersError = Error & { reason?: string; code?: string };

export function RPCError({ error }: { error: EthersError }) {
  return (
    <div className="space-y-3">
      <p className="text-red-500 font-semibold">Something went wrong in preparing your transaction</p>
      <p className="text-red-500">{error.reason ?? error.message}</p>
    </div>
  );
}
