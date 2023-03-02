import type { AvatarComponent } from "@rainbow-me/rainbowkit";
import {
  createAuthenticationAdapter,
  getDefaultWallets,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { useMemo } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { SiweMessage } from "siwe";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export declare type AuthenticationStatus = "loading" | "unauthenticated" | "authenticated";

const { chains, provider } = configureChains([polygon, mainnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "MetricsDAO",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img alt="ensImage" src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} />
  ) : (
    <Jazzicon diameter={100} seed={jsNumberForAddress(address)} />
  );
};

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
