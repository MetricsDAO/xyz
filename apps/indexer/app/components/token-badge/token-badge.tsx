import { useTokens } from "~/hooks/use-root-data";
import { fromTokenAmount } from "~/utils/helpers";
import { RewardBadge } from "../reward-badge";

export function TokenBadgeByAddress({ address, quantity }: { address: string; quantity: string }) {
  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === address);
  if (!token) {
    return null;
  }
  return <RewardBadge payment={{ amount: fromTokenAmount(quantity, token.decimals), token }} />;
}
