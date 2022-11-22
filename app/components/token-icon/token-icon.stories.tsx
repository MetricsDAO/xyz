import { TokenIcon } from "./token-icon";

// URL will fail since src url won't resolve
export const Fallback = () => {
  return <TokenIcon token={{ name: "Bitcoin", symbol: "BTC" }} />;
};
