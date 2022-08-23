import type { ReactElement } from "react";
import { ClientOnly } from "remix-utils";
import { WagmiConfig, createClient, configureChains, chain, defaultChains, defaultL2Chains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { infuraProvider } from "wagmi/providers/infura";

export default function WalletProvider({ children, network }: { children: ReactElement; network: string }) {
  let configureChainObj;

  //TODO create config of all chains we support

  // TODO configure for POLYGON

  const infuraId = "54fcc811bac44f99b84a04a4a3e2f998";

  if (network === "ropsten" || network == "goerli") {
    configureChainObj = configureChains(
      [chain.ropsten, chain.goerli],
      [infuraProvider({ infuraId }), publicProvider()]
    );
  } else if (network == "polygon") {
    configureChainObj = configureChains([chain.polygon], [infuraProvider({ infuraId }), publicProvider()]);
  } else {
    configureChainObj = configureChains(
      [chain.localhost, chain.hardhat],
      [infuraProvider({ infuraId }), publicProvider()]
    );
  }
  const { chains, provider, webSocketProvider } = configureChainObj;

  // Set up client
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      // TODO implement COINBASE WALLET
      //   new CoinbaseWalletConnector({
      //     chains,
      //     options: {
      //       appName: 'wagmi',
      //     },
      //   }),
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
        return <WagmiConfig client={client}>{children}</WagmiConfig>;
      }}
    </ClientOnly>
  );
}
