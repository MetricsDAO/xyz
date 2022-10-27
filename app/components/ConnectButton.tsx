import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import chainalysisAbi from "~/abi/chainalysis.json";
import { useAccount, useContractRead } from "wagmi";
import { useState } from "react";
import { logger } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function CustomConnectButton() {
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
              if (!connected) {
                return (
                  <button
                    className="btn rounded-md bg-gray-100 border py-1 px-2 bg-gradient-to-r from-[#67CCD3] to-[#C8D5A9]"
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
                    className="btn rounded-md py-1 px-2 bg-red-600 text-white"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn rounded-md bg-gray-100 border p-[2px] bg-gradient-to-r from-[#67CCD3] to-[#C8D5A9]"
                    onClick={openAccountModal}
                    type="button"
                  >
                    <div className="flex gap-2 justify-between items-center h-full bg-white rounded-md px-4">
                      {account.ensAvatar ? (
                        account.ensAvatar
                      ) : (
                        <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
                      )}
                      {account.ensName ? account.ensName : account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ""}
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
