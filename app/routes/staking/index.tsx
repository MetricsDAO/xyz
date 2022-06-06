import { useState, useEffect, Fragment, SetStateAction, Dispatch, ReactElement } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { WagmiConfig, createClient, configureChains, chain, useConnect, useContract, useAccount, useDisconnect } from 'wagmi'
// import type { Connector } from "wagmi";

import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import topChefcontract from "../../../../core-evm-contracts/artifacts/src/contracts/TopChef.sol/TopChef.json";

import { ClientOnly } from "remix-utils";
import { Buffer } from "buffer";

import RewardsHeader from "~/components/RewardsHeader";

const addres = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";  //TODO package
export default function Index() {
    return (
    <WalletProvider>
        <Wrapper />
    </WalletProvider>   
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
              <div className="tw-my-8 tw-inline-block tw-w-full tw-max-w-md tw-transform tw-overflow-hidden tw-rounded-2xl tw-bg-white tw-p-6 tw-text-left tw-align-middle tw-shadow-xl tw-transition-all">
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

function SelectWallet ({selectWalletObj, setIsOpen }: {selectWalletObj: any, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
    const {connect, connectors, error, isConnecting, pendingConnector, account} = selectWalletObj;

    if (account) {
        setIsOpen(false);
    }

  return (
    <div className="tw-flex tw-flex-col">
      {connectors.map((connector: any) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          className="tw-p-5 tw-mb-4 tw-border tw-rounded-lg tw-border-gray-300"
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

    //TODO create config of all chains we support

    const { chains, provider, webSocketProvider } = configureChains([chain.mainnet, chain.hardhat], [
        publicProvider(),
      ]);

      
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
        <ClientOnly>
            {() => {
            return (
            <WagmiConfig client={client} >
              {children}
            </WagmiConfig> 
            )
          }}
        </ClientOnly>
      )
}

function Wrapper () {
    let [isOpen, setIsOpen] = useState(false);
    // const [selectedConnector, setSelectedConnector] =
    // useState<Connector<any, any>>();
    const { data: account } = useAccount()
    const { connect, activeConnector, connectors, error, isConnecting, pendingConnector } =
      useConnect()
    const { disconnect } = useDisconnect();

    const contract = useContract({
        addressOrName: addres,
        contractInterface: topChefcontract.abi,
      });
      console.log('account', account, "contract", contract, "activeConnector", activeConnector);

    // useEffect(() => {
    //     if (activeConnector) {
    //       setSelectedConnector(activeConnector);
    //     }
    //   }, [activeConnector]);

    if (!window.Buffer) {
        window.Buffer = Buffer;
      }

    const selectWalletObj = {
        connectors,
        connect,
        error,
        isConnecting,
        pendingConnector,
        account
    }

    return (
        <div>
        <RewardsHeader link="/claim" linkText="Claim Metric" connectWallet={setIsOpen} account={account} disconnect={disconnect}/>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <SelectWallet selectWalletObj={selectWalletObj} setIsOpen={setIsOpen} />
        </Modal>
        </div>
    )
}