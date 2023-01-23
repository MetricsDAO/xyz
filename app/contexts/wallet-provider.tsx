import type { AvatarComponent } from "@rainbow-me/rainbowkit";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { RainbowKitAuthenticationProvider } from "@rainbow-me/rainbowkit";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { useMemo } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { SiweMessage } from "siwe";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, goerli, mainnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const INFURA_ID = "54fcc811bac44f99b84a04a4a3e2f998";
export declare type AuthenticationStatus = "loading" | "unauthenticated" | "authenticated";

// TODO: env var
const IS_DEV = true;
const DEV_CHAINS = [goerli, mainnet];

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img alt="ensImage" src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} />
  ) : (
    <Jazzicon diameter={100} seed={jsNumberForAddress(address)} />
  );
};

function useConfigs() {
  return useMemo(() => {
    const { chains, provider } = configureChains(
      [polygon, ...(IS_DEV ? DEV_CHAINS : [])],
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
}

/**
 * Return a wallet adapter for Rainbow Wallet SIWE.
 */
function useAuthenticationAdapter() {
  return useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch("/api/nonce");
        const json = await response.json();
        return json;
      },
      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId,
          nonce,
        });
      },
      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },
      verify: async ({ message, signature }) => {
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, signature }),
        });
        window.location.reload();
        return Boolean(verifyRes.ok);
      },
      signOut: async () => {
        await fetch("/api/logout");
      },
    });
  }, []);
}

export default function WalletProvider({
  children,
  authStatus,
}: {
  children: ReactNode;
  authStatus: AuthenticationStatus;
}) {
  const { client, chains } = useConfigs();
  const adapter = useAuthenticationAdapter();
  return (
    <WagmiConfig client={client}>
      <RainbowKitAuthenticationProvider adapter={adapter} status={authStatus}>
        <RainbowKitProvider avatar={CustomAvatar} chains={chains}>
          {children}
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}
