import { Slot } from "@radix-ui/react-slot";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// https://www.rainbowkit.com/docs/custom-connect-button
// Wraps any button as the ConnectButton component and checks if a user exists before performing the action of that button,
// so that if a user is not connected, they will be prompted to connect
function ConnectWalletWrapper(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        if (!ready) {
          return <Slot {...props} onClick={(e) => e.preventDefault()} />;
        }

        if (!connected) {
          return (
            <Slot
              {...props}
              onClick={(e) => {
                e.preventDefault();
                openConnectModal();
              }}
            />
          );
        }

        if (chain.unsupported || chain.name === "Ethereum") {
          return (
            <Slot
              {...props}
              onClick={(e) => {
                e.preventDefault();
                openChainModal();
              }}
            />
          );
        }

        return <Slot {...props} />;
      }}
    </ConnectButton.Custom>
  );
}

export default ConnectWalletWrapper;
