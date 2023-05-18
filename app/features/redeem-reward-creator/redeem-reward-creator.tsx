import { BigNumber } from "ethers";
import { useCallback, useState } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { SubmissionWithReward } from "~/domain/reward/functions.server";
import { useContracts } from "~/hooks/use-root-data";
import invariant from "tiny-invariant";
import { RedeemConfirmation } from "./redeem-confirmation";

interface RedeemRewardCreatorProps {
  submission: SubmissionWithReward;
  userAddress: EvmAddress;
}

export function RedeemRewardCreator({ submission, userAddress }: RedeemRewardCreatorProps) {
  const { token, paymentTokenAmount, iouSignature, hasClaimed } = submission.serviceProviderReward.reward;
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const contracts = useContracts();

  const redeemTransactor = useTransactor({
    onSuccess: () => {
      // we want to hide the redeem button to prevent a user from doing a "double redeem" while the transaction is pending in the treasury service
      setRedeemSuccess(true);
      fetch(`/api/reward/${submission.serviceProviderReward.reward.id}/mark-as-redeemed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  const startRedeem = useCallback(() => {
    invariant(iouSignature, "Missing signature");
    invariant(token, "Missing token");
    redeemTransactor.start({
      config: () =>
        configureRedeem({
          inputs: {
            iouTokenAddress: token.contractAddress as EvmAddress,
            laborMarketAddress: submission.laborMarketAddress,
            submissionId: submission.id,
            amount: paymentTokenAmount,
            signature: iouSignature as `0x${string}`,
          },
        }),
    });
  }, [iouSignature, paymentTokenAmount, redeemTransactor, submission.id, submission.laborMarketAddress, token]);

  const claimTransactor = useTransactor({
    onSuccess: startRedeem,
  });

  const startClaim = () => {
    claimTransactor.start({
      config: () =>
        configureClaim({
          contracts,
          inputs: {
            laborMarketAddress: submission.laborMarketAddress,
            submissionId: submission.id,
            payoutAddress: userAddress,
          },
        }),
    });
  };

  const onClick = () => {
    if (!hasClaimed) {
      startClaim();
    } else {
      startRedeem();
    }
  };

  return (
    <>
      <TxModal transactor={claimTransactor} title="Claim your reward!" />
      <TxModal
        transactor={redeemTransactor}
        title={`Redeem your native ${token?.networkName ?? ""} tokens!`}
        confirmationMessage={<RedeemConfirmation submission={submission} />}
      />
      <ConnectWalletWrapper onClick={onClick}>
        <Button disabled={redeemSuccess}>Claim</Button>
      </ConnectWalletWrapper>
    </>
  );
}

function configureClaim({
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    laborMarketAddress: EvmAddress;
    submissionId: string;
    payoutAddress: EvmAddress;
  };
}) {
  return configureWrite({
    address: inputs.laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "claim",
    args: [BigNumber.from(inputs.submissionId), inputs.payoutAddress],
  });
}

function configureRedeem({
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
