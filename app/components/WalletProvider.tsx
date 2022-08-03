import type { ReactElement } from "react";
import { ClientOnly } from "remix-utils";
import { WagmiConfig, createClient, configureChains, chain, defaultChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura';
export default function WalletProvider ({children}: {children: ReactElement}) {

    //TODO create config of all chains we support
    const infuraId = "54fcc811bac44f99b84a04a4a3e2f998"

    const { chains, provider, webSocketProvider } = configureChains(
      defaultChains,
      [infuraProvider({ infuraId }), publicProvider()]
    );

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
              name: 'Injected',
              shimDisconnect: true,
            },
          }),
        ],
        provider,
        webSocketProvider,
      })

      return (
        <ClientOnly>
            {() => {
            return (
            <WagmiConfig client={client}>
              {children}
            </WagmiConfig> 
            )
          }}
        </ClientOnly>
      )
}