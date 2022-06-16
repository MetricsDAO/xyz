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