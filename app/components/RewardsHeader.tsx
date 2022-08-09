import type { Dispatch, ReactSVGElement, SetStateAction} from "react";
import React, { Fragment } from "react";
import { Link } from "remix";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDown16, Copy16, Close16 } from "@carbon/icons-react";
import type { GetAccountResult, Provider } from "@wagmi/core";

import ConnectWalletButton from "./ConnectWalletButton";
import NetworkRender from "~/components/NetworkRender";
import { truncateAddress, getIcon } from "~/utils/helpers";




export default function RewardsHeader ({
    link, 
    linkText, 
    connectWallet, 
    account, 
    network, 
    disconnect,
    chainId,
    switchNetwork,
    chainName,
    }: {
        link:string, 
        linkText: string, 
        connectWallet:Dispatch<SetStateAction<boolean>>, 
        account: GetAccountResult<Provider> | undefined,
        disconnect: () => void, 
        network: string,
        chainId: number,
        switchNetwork?: (chainId?:number) => void,
        chainName?: string,
    }) {

    function copyText(e: React.MouseEvent<ReactSVGElement, MouseEvent>) {
        e.preventDefault();
        if (account?.address) {
            navigator.clipboard.writeText(account.address);
        }
    }

    return (
        <header className="tw-max-w-screen-xl tw-flex tw-mx-auto tw-my-5 tw-items-center">
                <Link
                    to="/"
                    className="tw-no-underline"
                >
                    <img
                        src="img/bw-lightbg@2x.png"
                        alt="MetricsDAO"
                        width="241"
                        height="44"
                        className="tw-mr-12"
                    />
                </Link>
                <Link
                    to={link}
                    className="tw-no-underline"
                >
                    <p>{linkText}</p>
                </Link>
                {account ? (
                    <div className="tw-ml-auto">
                    <Menu as="div" className="tw-relative tw-inline-block tw-text-left">
                    <Menu.Button className="tw-py-2 tw-inline-flex tw-items-center">
                         <img width="30" className="tw-mr-2" height="30" alt="wallet logo" src={getIcon(account.connector?.name)} />
                         <span className="tw-text-sm">{truncateAddress(account.address)}</span>
                         <ChevronDown16 className="tw-inline tw-ml-2" />
                    </Menu.Button>
                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="tw-absolute tw-right-0 tw-mt-2 tw-w-56 tw-bg-white tw-py-3 tw-px-2 tw-rounded-lg tw-shadow-[#1f368d14] tw-shadow-md">
                        <Menu.Item>
                            {({ active }) => (
                                <div className={`tw-flex tw-items-center tw-px-2 tw-rounded-lg tw-py-2 tw-justify-between ${active ? 'tw-bg-[#F6F7F8]' : 'tw-bg-transparent'}` }>
                                    <img width="30" className="tw-mr-2" height="30" alt="wallet logo" src={getIcon(account.connector?.name)} />
                                    <p className="tw-text-sm">{truncateAddress(account.address)}</p>
                                    <p className="tw-rounded-full tw-border-[#EBEDF3] tw-p-2 tw-border"><Copy16 className="tw-cursor-pointer" onClick={copyText} /></p>
                                </div>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <div className={`tw-flex tw-items-center tw-px-2 tw-rounded-lg tw-py-2 ${active ? 'tw-bg-[#F6F7F8]' : 'tw-bg-transparent'}`}>
                                    <button onClick={disconnect}  className="tw-rounded-full tw-border-[#EBEDF3] tw-p-2 tw-border tw-mr-4"><Close16 /></button>
                                    <p className="tw-text-sm">Disconnect</p>
                                </div>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                    </Transition>

                    </Menu>
                    <NetworkRender 
                        network={network} 
                        chainName={chainName} 
                        chainId={chainId}
                        switchNetwork={switchNetwork}
                        />
                    </div>
                ) : (
                    <ConnectWalletButton buttonText="Connect Wallet" connectWallet={connectWallet} />
                )}
        </header>
    )
}