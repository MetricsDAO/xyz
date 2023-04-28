import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";

interface RedeemRewardCreatorProps {
  disabled: boolean;
  iouTokenAddress: EvmAddress;
  laborMarketAddress: EvmAddress;
  submissionId: string;
  amount: string;
  signature: `0x${string}`;
  confirmationMessage?: React.ReactNode;
}

export function RedeemRewardCreator({
  disabled,
  iouTokenAddress,
  laborMarketAddress,
  submissionId,
  amount,
  confirmationMessage,
  signature,
}: RedeemRewardCreatorProps) {
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        // reload page
        navigate(0);
      },
      [navigate]
    ),
  });

  const onClick = () => {
    transactor.start({
      config: () =>
        configureFromValues({
          inputs: { iouTokenAddress, laborMarketAddress, submissionId, amount, signature },
        }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} title="Redeem your native tokens!" confirmationMessage={confirmationMessage} />
      <ConnectWalletWrapper onClick={onClick}>
        <Button disabled={disabled}>Redeem</Button>
      </ConnectWalletWrapper>
    </>
  );
}

function configureFromValues({
  inputs,
}: {
  inputs: {
    iouTokenAddress: EvmAddress;
    laborMarketAddress: EvmAddress;
    submissionId: string;
    amount: string;
    signature: `0x${string}`;
  };
}) {
  const { iouTokenAddress, laborMarketAddress, submissionId, amount, signature } = inputs;
  return configureWrite({
    address: iouTokenAddress,
    abi: PARTIAL_IOU_TOKEN_ABI,
    functionName: "redeem",
    args: [laborMarketAddress, BigNumber.from(submissionId), "submission", BigNumber.from(amount), signature],
  });
}

const PARTIAL_IOU_TOKEN_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_marketplaceAddress", type: "address" },
      { internalType: "uint256", name: "_participationId", type: "uint256" },
      { internalType: "string", name: "_participationType", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "bytes", name: "_signature", type: "bytes" },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
