import type { ReactElement } from "react";
import { ClientOnly } from "remix-utils";
import { WagmiConfig, createClient, configureChains, chain, defaultChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { infuraProvider } from "wagmi/providers/infura";

export default function WalletProvider({ children, network }: { children: ReactElement; network: string }) {
  let configureChainObj;

  const infuraId = "54fcc811bac44f99b84a04a4a3e2f998";
  configureChainObj = configureChains(
    [...defaultChains, chain.polygon, chain.hardhat, chain.localhost], 
    [infuraProvider({ apiKey: infuraId }), publicProvider()]
  );

  // TODO: Are we good to delete this? I'm not sure if we necessarily need to configure based on our network
  //       instead of just configured everything we may need.
  
  // if (network === "ropsten") {
  //   configureChainObj = configureChains(defaultChains, [infuraProvider({ apiKey: infuraId }), publicProvider()]);
  // } else if (network === "polygon") {
  //   configureChainObj = configureChains([...defaultChains, chain.polygon], [infuraProvider({ apiKey: infuraId }), publicProvider()]);
  // } else if (network === "localhost") {
  //   configureChainObj = configureChains([...defaultChains, chain.polygon, chain.hardhat, chain.localhost], [publicProvider()]);
  // } else {
  //   //nothing provided will lead to front end error
  //   configureChainObj = configureChains(defaultChains, [publicProvider()]);
  // }
  const { chains, provider, webSocketProvider } = configureChainObj;

  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "question API",
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  });

  return (
    <ClientOnly>
      {() => {
        if (!network) {
          window.alert("Please configure Network");
          return null;
        }
        return <WagmiConfig client={client}>{children}</WagmiConfig>;
      }}
    </ClientOnly>
  );
}
