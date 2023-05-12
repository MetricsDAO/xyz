import { BigNumber } from "ethers";
import { useState } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";

interface RedeemRewardCreatorProps {
  disabled: boolean;
  iouTokenAddress: EvmAddress;
  iouSignature: `0x${string}`;
  submission: SubmissionWithReward;
  confirmationMessage?: React.ReactNode;
}

export function RedeemRewardCreator({
  disabled,
  confirmationMessage,
  iouTokenAddress,
  iouSignature,
  submission,
}: RedeemRewardCreatorProps) {
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const transactor = useTransactor({
    onSuccess: () => {
      // we want to hide the redeem button to prevent a user from doing a "double redeem"
      setRedeemSuccess(true);
      fetch(`/api/reward/${submission.serviceProviderReward.reward.id}/mark-as-redeemed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onClick = () => {
    transactor.start({
      config: () =>
        configureFromValues({
          inputs: {
            iouTokenAddress,
            laborMarketAddress: submission.laborMarketAddress,
            submissionId: submission.id,
            amount: submission.serviceProviderReward.reward.paymentTokenAmount,
            signature: iouSignature,
          },
        }),
    });
  };

  return (
    <>
      {transactor.state !== "success" && (
        <TxModal transactor={transactor} title="Redeem your native tokens!" confirmationMessage={confirmationMessage} />
      )}
      <ConnectWalletWrapper onClick={onClick}>
        <Button disabled={disabled || redeemSuccess}>Redeem</Button>
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
