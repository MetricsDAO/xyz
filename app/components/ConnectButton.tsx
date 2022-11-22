import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { logger } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChainalysisContract } from "~/hooks/useChainalysisContract";
import { Button } from "~/components/button";

function CustomConnectButton() {
  const { disconnect } = useDisconnect();

  const [connected, setConnected] = useState(false);

  const account = useAccount({
    onConnect({ address }) {
      logger.info(address + " successfully connected");
      setConnected(true);
    },
  });

  const { data: isSanctionedAddress } = useChainalysisContract(account.address ? account.address : "");

  useEffect(() => {
    if (isSanctionedAddress === true && connected) {
      disconnect();
      setConnected(false);
      logger.info("address " + account.address + " was sanctioned and therefore disconnected");
    }
  }, [connected, disconnect, account.address, isSanctionedAddress]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        if (isSanctionedAddress === true) {
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
                return <Button onClick={openConnectModal}>Sanctioned Address</Button>;
              } else if (!connected) {
                return (
                  <Button variant="gradient" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported || chain.name == "Ethereum") {
                return (
                  <Button variant="danger" onClick={openChainModal}>
                    Switch to Polygon
                  </Button>
                );
              }

              return (
                <div>
                  <Button onClick={openAccountModal} variant="gradient">
                    <div className="flex flex-row gap-2 items-center align-middle">
                      {account.ensAvatar ? (
                        account.ensAvatar
                      ) : (
                        <div className="rounded-full">
                          <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
                        </div>
                      )}
                      {account.ensName ? account.ensName : account.displayName}
                      {/* //TODO: later we will show metric and xmetric balances
                      {account.displayBalance ? ` (${account.displayBalance})` : ""} */}
                    </div>
                  </Button>
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
