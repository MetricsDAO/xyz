import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "~/components/button";

// https://www.rainbowkit.com/docs/custom-connect-button
function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        if (!ready) {
          // The docs make this a blank state with opactiy 0, but might be better to show a loading indicator of some sort
          return (
            <Button variant="gradient" className="pointer-events-none select-none opacity-0">
              Connect Wallet
            </Button>
          );
        }

        if (!connected) {
          return (
            <Button variant="gradient" onClick={openConnectModal}>
              Connect Wallet
            </Button>
          );
        }

        if (chain.unsupported || chain.name === "Ethereum") {
          return (
            <Button variant="danger" onClick={openChainModal}>
              Switch Chain
            </Button>
          );
        }

        return (
          <div>
            <Button onClick={openAccountModal} variant="gradient">
              <div className="flex flex-row gap-2 items-center align-middle">
                {account.ensAvatar ? (
                  <img src={account.ensAvatar} alt="" />
                ) : (
                  <div className="rounded-full">
                    <Jazzicon diameter={20} seed={jsNumberForAddress(account.address)} />
                  </div>
                )}
                {account.ensName ? account.ensName : account.displayName}
                {/* //TODO: later we will show metric and xmetric balances */}
                {account.displayBalance ? ` (${account.displayBalance})` : ""}
              </div>
            </Button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;
