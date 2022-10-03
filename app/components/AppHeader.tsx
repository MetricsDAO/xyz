import { Link } from "@remix-run/react";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { truncateAddress } from "~/utils/helpers";
import ConnectWalletButton from "./ConnectWalletButton";

export default function AppHeader() {
  const { disconnect } = useDisconnect();
  const { address, connector } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="tw-flex tw-mx-6 tw-py-2 tw-border-b">
      <Link to="/" className="tw-no-underline tw-flex tw-mr-12 tw-items-center">
        <img src="/img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mr-2" />
        <p>
          Metrics<b>DAO</b>
        </p>
      </Link>
      <div className="tw-flex tw-space-x-7 tw-items-center">
        <Link to={"/questions"} className="tw-no-underline">
          <p>{"Questions"}</p>
        </Link>
      </div>
      <div className="tw-ml-auto">
        {address ? (
          <button
            onClick={() => disconnect}
            className="tw-rounded-lg tw-bg-[#21C5F2] tw-text-white border-gradient tw-px-5 tw-py-3 tw-max-w-sm tw-border"
          >
            <p className="tw-text-sm">{truncateAddress(address)}</p>
          </button>
        ) : (
          <ConnectWalletButton buttonText="Connect Wallet" connectWallet={setIsOpen} />
        )}
      </div>
    </header>
  );
}
