import { ChevronDown16, Close16, Copy16 } from "@carbon/icons-react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import { useAccount, useDisconnect } from "wagmi";
import NetworkRender from "~/components/NetworkRender";
import { getIcon, truncateAddress } from "~/utils/helpers";
import ConnectWalletButton from "./ConnectWalletButton";
import Modal from "./Modal";

export default function WalletConnector() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (address && isOpen) {
      setIsOpen(false);
    }
  }, [address, isOpen]);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)} />
      {address ? (
        <div className="tw-ml-auto">
          <Menu as="div" className="tw-relative tw-inline-block tw-text-left">
            <Menu.Button className="tw-py-2 tw-inline-flex tw-items-center">
              <img width="30" className="tw-mr-2" height="30" alt="wallet logo" src={getIcon(connector?.name)} />
              <span className="tw-text-sm">{truncateAddress(address)}</span>
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
                    <div
                      className={`tw-flex tw-items-center tw-px-2 tw-rounded-lg tw-py-2 tw-justify-between ${
                        active ? "tw-bg-[#F6F7F8]" : "tw-bg-transparent"
                      }`}
                    >
                      <img
                        width="30"
                        className="tw-mr-2"
                        height="30"
                        alt="wallet logo"
                        src={getIcon(connector?.name)}
                      />
                      <p className="tw-text-sm">{truncateAddress(address)}</p>
                      <p className="tw-rounded-full tw-border-[#EBEDF3] tw-p-2 tw-border">
                        <Copy16 className="tw-cursor-pointer" onClick={() => copyText(address)} />
                      </p>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`tw-flex tw-items-center tw-px-2 tw-rounded-lg tw-py-2 ${
                        active ? "tw-bg-[#F6F7F8]" : "tw-bg-transparent"
                      }`}
                    >
                      <button
                        onClick={() => disconnect()}
                        className="tw-rounded-full tw-border-[#EBEDF3] tw-p-2 tw-border tw-mr-4"
                      >
                        <Close16 />
                      </button>
                      <p className="tw-text-sm">Disconnect</p>
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
          <NetworkRender />
        </div>
      ) : (
        <ConnectWalletButton buttonText="Connect Wallet" onClick={() => setIsOpen(true)} />
      )}
    </>
  );
}
