import type { AvatarComponent } from "@rainbow-me/rainbowkit";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { useMemo } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const INFURA_ID = "54fcc811bac44f99b84a04a4a3e2f998";

// TODO: env var
const IS_DEV = true;
const DEV_CHAINS = [chain.goerli];

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img alt="ensImage" src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} />
  ) : (
    <Jazzicon diameter={100} seed={jsNumberForAddress(address)} />
  );
};

export default function WalletProvider({ children }: { children: ReactNode }) {
  const { client, chains } = useMemo(() => {
    const { chains, provider } = configureChains(
      [chain.polygon, ...(IS_DEV ? DEV_CHAINS : [])],
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
      <RainbowKitProvider avatar={CustomAvatar} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
