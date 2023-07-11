import { BigNumber } from "ethers";
import { useCallback, useEffect } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { iouTokenAbi } from "~/abi/iou-token";

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
    abi: iouTokenAbi,
    address: source,
    functionName: "issue",
    args: [to, BigNumber.from(amount), BigNumber.from(nonce), BigNumber.from(expiry), signature],
  });
}
