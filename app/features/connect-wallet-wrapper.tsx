import { Slot } from "@radix-ui/react-slot";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useApproveERC20 } from "~/hooks/use-approve-erc20";

// https://www.rainbowkit.com/docs/custom-connect-button
function ConnectWalletWrapper(props: { children: React.ReactNode }) {
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
