import { useState, Fragment, SetStateAction, Dispatch, ReactElement, Children } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { WagmiConfig, createClient, defaultChains, configureChains, useConnect } from 'wagmi'

import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import RewardsHeader from "~/components/RewardsHeader";
export default function Index() {
    let [isOpen, setIsOpen] = useState(false);

    function connectWallet () {

    }
    return (
        <>
        <RewardsHeader link="/claim" linkText="Claim Metric" connectWallet={setIsOpen}/>
        <WalletProvider>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <SelectWallet/>
            </Modal>
        </WalletProvider>   
        </>
    )
}

function Modal ({isOpen, setIsOpen, children}: {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, children: ReactElement}) {

    return (
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          className="tw-fixed tw-inset-0 tw-z-10 tw-overflow-y-auto"
          onClose={() => null}
        >
          <div className="tw-min-h-screen tw-px-0 tw-text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="tw-fixed tw-inset-0 tw-bg-[#262B33] tw-opacity-75" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="tw-inline-block tw-h-screen tw-align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="tw-my-8 tw-inline-block tw-w-full tw-max-w-md tw-transform tw-overflow-hidden tw-rounded-2xl tw-bg-white tw-p-0 tw-text-left tw-align-middle tw-shadow-xl tw-transition-all">
                  <Dialog.Title
                    as="h3"
                    className="tw-mb-[30px] tw-mt-[25px] tw-text-center tw-text-lg tw-font-medium leading-6"
                  >
                    Connect your wallet
                  </Dialog.Title>
                  <p>Connect the wallet you want to use to claim rewards in your wallet.</p>

                <div>{children}</div>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    )
}

function SelectWallet () {
    const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect()

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}

function WalletProvider ({children}: {children: ReactElement}) {
    const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
        // alchemyProvider({ alchemyId }),
        publicProvider(),
      ])
      
      // Set up client
      const client = createClient({
        autoConnect: true,
        connectors: [
          new MetaMaskConnector({ chains }),
          new CoinbaseWalletConnector({
            chains,
            options: {
              appName: 'wagmi',
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
              name: 'Injected',
              shimDisconnect: true,
            },
          }),
        ],
        provider,
        webSocketProvider,
      })

      return (
          <WagmiConfig client={client} >
              {children}
          </WagmiConfig>
      )
}