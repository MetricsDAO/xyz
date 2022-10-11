import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const INFURA_ID = "54fcc811bac44f99b84a04a4a3e2f998";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const { client, chains } = useMemo(() => {
    const { chains, provider } = configureChains(
      [chain.polygon],
      [infuraProvider({ apiKey: INFURA_ID }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "MetricsDAO",
      chains,
    });

    const client = createClient({
      autoConnect: true,
      connectors,
      provider,
    });

    return { client, chains };
  }, []);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
