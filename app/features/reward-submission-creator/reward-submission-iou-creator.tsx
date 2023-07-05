import { BigNumber } from "ethers";
import { useCallback, useState } from "react";
import invariant from "tiny-invariant";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import type { SubmissionWithReward } from "~/domain/submission/schemas";
import { useContracts, useTokens, useWallets } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import { NoPayoutAddressFoundModalButton } from "../my-rewards/no-payout-address-modal-button";
import { RedeemConfirmation } from "../my-rewards/redeem-confirmation";

interface RedeemRewardCreatorProps {
  submission: SubmissionWithReward;
}

export function SubmissionIOURewardCreator({ submission }: RedeemRewardCreatorProps) {
  const wallets = useWallets();

  const tokens = useTokens();
  const token = tokens.find((t) => t.contractAddress === submission.sr.configuration.pTokenProvider);

  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const contracts = useContracts();

  const redeemTransactor = useTransactor({
    onSuccess: () => {
      const { laborMarketAddress, serviceRequestId, id } = submission;
      // we want to hide the redeem button to prevent a user from doing a "double redeem" while the transaction is pending in the treasury service
      setRedeemSuccess(true);
      fetch(`/api/market/${laborMarketAddress}/request/${serviceRequestId}/submission/${id}/iou-redeemed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  const startRedeem = useCallback(() => {
    const signature = submission.reward.iouSignature;
    invariant(signature, "Missing signature");
    invariant(token, "Missing token");
    redeemTransactor.start({
      config: () =>
        configureRedeem({
          inputs: {
            iouTokenAddress: token.contractAddress as EvmAddress,
            laborMarketAddress: submission.laborMarketAddress,
            submissionId: submission.id,
            amount: submission.reward.tokenAmount,
            signature: signature as `0x${string}`,
          },
        }),
    });
    // We can't have redeemTransactor be part of this list of dependencies because it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    submission.reward.iouSignature,
    submission.reward.tokenAmount,
    submission.id,
    submission.laborMarketAddress,
    token,
  ]);

  const claimTransactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        setClaimSuccess(true);
        startRedeem();
      },
      [startRedeem]
    ),
  });

  const startClaim = () => {
    claimTransactor.start({
      config: () =>
        configureClaim({
          contracts,
          inputs: {
            laborMarketAddress: submission.laborMarketAddress,
            serviceRequestId: submission.serviceRequestId,
            submissionId: submission.id,
          },
        }),
    });
  };

  const onClick = () => {
    if (!submission.rewardClaimed && !claimSuccess) {
      startClaim();
    } else {
      startRedeem();
    }
  };

  if (redeemSuccess) {
    return <p>Pending</p>;
  }

  if (submission.reward.iouHasRedeemed) {
    // "redeemed"
    return <p>Claimed</p>;
  }

  if (submission.reward.iouClientTransactionSuccess) {
    // waiting on treasury service
    return <p>Pending</p>;
  }

  const wallet = wallets.find((w) => w.networkName === token?.networkName);
  // Treasury service will be looking for this wallet to make the native token payout to
  if (!wallet) {
    return <NoPayoutAddressFoundModalButton buttonText="Claim" networkName={token?.networkName} />;
  }

  return (
    <>
      <TxModal
        transactor={claimTransactor}
        title="Begin Reward Claim"
        confirmationMessage="This process requires two transactions."
      />
      <TxModal
        transactor={redeemTransactor}
        title="Claim Reward"
        confirmationMessage={
          <RedeemConfirmation payoutAmount={submission.reward.tokenAmount} token={token} wallet={wallet} />
        }
      />
      <ConnectWalletWrapper onClick={onClick}>
        <Button>Claim</Button>
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
    serviceRequestId: string;
    submissionId: string;
  };
}) {
  return configureWrite({
    address: inputs.laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "claim",
    args: [BigNumber.from(inputs.submissionId), BigNumber.from(inputs.serviceRequestId)],
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
