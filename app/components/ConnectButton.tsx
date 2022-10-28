import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import chainalysisAbi from "~/abi/chainalysis.json";
import { useAccount, useContractRead, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { logger } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function CustomConnectButton() {
  const { disconnect } = useDisconnect();

  const [connected, setConnected] = useState(false);

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      logger.info(address + "successfully connected");
      setConnected(true);
    },
  });

  const contract_address = "0x40c57923924b5c5c5455c48d93317139addac8fb";

  const { data } = useContractRead({
    address: contract_address,
    abi: chainalysisAbi.abi,
    functionName: "isSanctioned",
    args: [account.address],
    enabled: connected,
  });

  useEffect(() => {
    if (data === true && connected) {
      disconnect();
      setConnected(false);
      logger.info("address " + account.address + " was sanctioned and therefore disconnected");
    }
  }, [data, connected, disconnect, account.address]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        if (data === true) {
          authenticationStatus = "unauthenticated";
        }

        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (authenticationStatus === "unauthenticated") {
                return (
                  <button
                    className="btn rounded-md py-2 px-2 bg-red-600 text-white border-none text-sm"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Sanctioned Address
                  </button>
                );
              } else if (!connected) {
                return (
                  <button
                    className="btn rounded-md bg-gray-100 py-2 px-2 bg-gradient-to-r from-[#67CCD3] to-[#C8D5A9] border-none text-sm"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chain.name == "Ethereum") {
                return (
                  <button
                    className="btn rounded-md py-2 px-2 bg-red-600 text-white border-none text-sm"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div>
                  <button
                    className="btn rounded-md bg-gray-100 p-[3px] bg-gradient-to-r from-[#67CCD3] to-[#C8D5A9] border-none items-center align-middle text-sm"
                    onClick={openAccountModal}
                    type="button"
                  >
                    <div className="flex flex-row gap-2 h-full bg-white align-middle rounded pt-1 px-4">
                      {account.ensAvatar ? (
                        account.ensAvatar
                      ) : (
                        <div className="rounded-full">
                          <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
                        </div>
                      )}
                      {account.ensName ? account.ensName : account.displayName}
                      {/* {account.displayBalance ? ` (${account.displayBalance})` : ""} */}
                    </div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;
