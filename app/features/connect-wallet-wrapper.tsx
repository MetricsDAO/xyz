import { Slot } from "@radix-ui/react-slot";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { redirect } from "@remix-run/server-runtime";
import { useEffect, useState } from "react";

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

        if (chain.unsupported) {
          return (
            <Slot
              {...props}
              onClick={(e) => {
                !connected ? e.preventDefault() : null;
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
