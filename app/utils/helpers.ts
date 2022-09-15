import { useEffect, useRef } from "react";
import type { QuestionData } from "~/utils/types";
export function truncateAddress(address: string | undefined) {
  if (address) {
    return address.substring(0, 5) + "..." + address.substring(address.length - 5);
  }
}

export function filteredNetwork(network: string) {
  return network === "localhost" ? "hardhat" : network;
}

export function getIcon(connectorName: string | undefined) {
  if (connectorName) {
    return WALLET_ICONS[connectorName] || WALLET_ICONS.WalletIcon;
  }
}

const WALLET_ICONS: Record<string, string> = {
  WalletConnect: "/img/wallet-connect-white.svg",
  MetaMask: "/img/metamask-fox.svg",
  WalletIcon: "img/wallet-icon.svg",
};

export const iPFSdomain = "https://ipfs.io/ipfs/";

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
export const PAGINATION_AMOUNT = 10;

// TODO DO WE CHANGE
export const sortMethods = [
  {
    name: "Votes",
  },
  {
    name: "Newest",
  },
];

// TODO How to get protocols

export const protocols = [
  { name: "Ethereum" },
  { name: "Flow" },
  { name: "Algorand" },
  { name: "THORchain" },
  { name: "Cosmos" },
  { name: "Polygon" },
];

export function filterSortCsvData(questionArray: QuestionData[]) {
  return questionArray.map((obj) => {
    delete obj.loading;
    delete obj.unavailable;
    return obj;
  });
}
