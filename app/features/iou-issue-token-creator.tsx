import { BigNumber } from "ethers";
import { useCallback, useEffect } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";

interface IOUIssueTokenCreatorProps {
  source: EvmAddress;
  to: EvmAddress;
  amount: string;
  nonce: string;
  expiry: number;
  signature: `0x${string}`;
  startTransaction: boolean;
}

export function IOUIssueTokenCreator(props: IOUIssueTokenCreatorProps) {
  const transactor = useTransactor({
    onSuccess: useCallback((receipt) => {}, []),
  });

  useEffect(() => {
    if (props.startTransaction) {
      transactor.start({
        config: () => configureFromValues(props),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.startTransaction]);

  return <TxModal transactor={transactor} title="Issue tokens" />;
}

function configureFromValues(inputs: {
  source: EvmAddress;
  to: EvmAddress;
  amount: string;
  nonce: string;
  expiry: number;
  signature: `0x${string}`;
}) {
  const { source, to, amount, nonce, expiry, signature } = inputs;
  return configureWrite({
    abi: PARTIAL_IOU_CONTRACT_ABI,
    address: source,
    functionName: "issue",
    args: [to, BigNumber.from(amount), BigNumber.from(nonce), BigNumber.from(expiry), signature],
  });
}

const PARTIAL_IOU_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_nonce", type: "uint256" },
      { internalType: "uint256", name: "_expiry", type: "uint256" },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "issue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
