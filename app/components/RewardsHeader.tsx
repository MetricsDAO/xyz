import type { Dispatch, ReactSVGElement, SetStateAction } from "react";
import React, { Fragment } from "react";
import { Link } from "@remix-run/react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown16, Copy16, Close16 } from "@carbon/icons-react";

import ConnectWalletButton from "./ConnectWalletButton";
import NetworkRender from "~/components/NetworkRender";
import { truncateAddress, getIcon } from "~/utils/helpers";

export default function RewardsHeader({
  connectWallet,
  address,
  activeConnector,
  network,
  disconnect,
  chainId,
  switchNetwork,
  chainName,
}: {
  connectWallet: Dispatch<SetStateAction<boolean>>;
  address: string | undefined;
  disconnect: () => void;
  network: string;
  chainId?: number;
  switchNetwork?: (chainId?: number) => void;
  chainName?: string;
  activeConnector?: string | undefined;
}) {
  function copyText(e: React.MouseEvent<ReactSVGElement, MouseEvent>) {
    e.preventDefault();
    if (address) {
      navigator.clipboard.writeText(address);
    }
  }

  return (
    <header className="tw-w-full tw-flex tw-mx-6 tw-my-2">
      <Link to="/" className="tw-no-underline tw-flex tw-mr-12 tw-items-center">
        <img src="img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mr-2" />
        <p>
          Metrics<b>DAO</b>
        </p>
      </Link>
      <div className="tw-flex tw-space-x-7 tw-items-center">
        <Link to={"/all-questions"} className="tw-no-underline">
          <p>{"Question"}</p>
        </Link>
      </div>
      <div className="tw-ml-auto tw-mr-20">
        {address ? (
          <button
            onClick={disconnect}
            className="tw-rounded-lg tw-bg-[#21C5F2] tw-text-white tw-border-[#EBEDF3]  tw-px-5 tw-py-3 tw-max-w-xs tw-border tw-mr-4"
          >
            <p className="tw-text-sm">{truncateAddress(address)}</p>
          </button>
        ) : (
          <ConnectWalletButton buttonText="Connect Wallet" connectWallet={connectWallet} />
        )}
      </div>
    </header>
  );
}
