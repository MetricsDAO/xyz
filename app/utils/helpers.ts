import { useEffect, useRef } from "react";
export function truncateAddress (address: String) {
    return address.substring(0, 5) + "..." + address.substring(address.length - 5);
}

export function getIcon(connectorName: string) {
    return WALLET_ICONS[connectorName] || WALLET_ICONS.WalletIcon;
}

const WALLET_ICONS: Record<string, string> = {
    WalletConnect: "/img/wallet-connect-white.svg",
    MetaMask: "/img/metamask-fox.svg",
    WalletIcon: "img/wallet-icon.svg"
  };



export function usePrevious(value:any) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    },[value]);
    return ref.current;
}