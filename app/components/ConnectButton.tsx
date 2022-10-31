import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { logger } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@mantine/core";
import { useChainalysisContract } from "~/hooks/useChainalysisContract";

function CustomConnectButton() {
  const { disconnect } = useDisconnect();

  const [connected, setConnected] = useState(false);

  const account = useAccount({
    onConnect({ address }) {
      logger.info(address + "successfully connected");
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
                return (
                  <Button color="red" onClick={openConnectModal} type="button">
                    Sanctioned Address
                  </Button>
                );
              } else if (!connected) {
                return (
                  <Button
                    sx={{ color: "black" }}
                    variant="gradient"
                    gradient={{ from: "#00C2FF", to: "#B9E09B", deg: 60 }}
                    size="md"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported || chain.name == "Ethereum") {
                return (
                  <Button color="red" onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                );
              }

              return (
                <div>
                  <Button
                    variant="outline"
                    color="white"
                    sx={{ borderColor: "#A2DDF1", borderWidth: "2px" }}
                    onClick={openAccountModal}
                    type="button"
                    radius="sm"
                  >
                    <div className="flex flex-row gap-2 text-black items-center align-middle">
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
