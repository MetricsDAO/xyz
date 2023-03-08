import type { AvatarComponent } from "@rainbow-me/rainbowkit";
import {
  createAuthenticationAdapter,
  getDefaultWallets,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { SiweMessage } from "siwe";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useOptionalUser } from "~/hooks/use-user";

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
  const user = useOptionalUser();
  const account = useAccount();
  // If the user is logged in but the account is different (e.g. they changed account in Metamask), log them out and reload the page.
  useEffect(() => {
    if (user?.address && user?.address !== account.address) {
      fetch("/api/logout").then(() => {
        window.location.reload();
      });
    }
  }, [user?.address, account.address]);
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
