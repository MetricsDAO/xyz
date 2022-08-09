import { useEffect, useRef } from "react";
export function truncateAddress (address: string | undefined) {
    if (address) {
        return address.substring(0, 5) + "..." + address.substring(address.length - 5);
    }
}

export function getIcon(connectorName: string | undefined) {
    if (connectorName) {
    return WALLET_ICONS[connectorName] || WALLET_ICONS.WalletIcon;
    }
}

const WALLET_ICONS: Record<string, string> = {
    WalletConnect: "/img/wallet-connect-white.svg",
    MetaMask: "/img/metamask-fox.svg",
    WalletIcon: "img/wallet-icon.svg"
  };



export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export enum TransactionStatus {
    Pending = "pending",
    Approved = "approved",
    Failed = "Failed",
  }

export const questionStateEnum = {
    UNINIT: 0,
    VOTING: 1,
    PUBLISHED: 2,
    IN_GRADING: 3,
    COMPLETED: 4,
    CANCELLED: 5,
    BAD: 6,
};

export const OFFSET = 1000;



// TODO DO WE CHANGE
export const sortMethods = [
  {
    name: 'Votes',
  },
  {
    name: 'Newest',
  },
  {
    name: 'Program',
  },
];

// TODO How to get protocols

export const protocols = [
  { name: 'All'},
  { name: 'Ethereum' },
  { name: 'Flow' },
  { name: 'Algorand' },
  { name: 'THORchain' },
  { name: 'Cosmos' },
  { name: 'Polygon' },
]