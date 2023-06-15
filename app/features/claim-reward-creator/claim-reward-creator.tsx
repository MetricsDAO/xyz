import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import type { SubmissionWithReward } from "~/domain/submission/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";

interface ClaimRewardCreatorProps {
  submission: SubmissionWithReward;
  confirmationMessage?: React.ReactNode;
}

export function ClaimRewardCreator({ submission, confirmationMessage }: ClaimRewardCreatorProps) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        // reload page
        // TODO call the index-event API and then reload the page
        navigate(0);
      },
      [navigate]
    ),
  });

  const onClick = () => {
    transactor.start({
      config: () =>
        configureFromValues({
          contracts,
          inputs: {
            laborMarketAddress: submission.laborMarketAddress,
            serviceRequestId: submission.serviceRequestId,
            submissionId: submission.id,
          },
        }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} title="Claim your reward!" confirmationMessage={confirmationMessage} />
      <ConnectWalletWrapper onClick={onClick}>
        <Button>Claim</Button>
      </ConnectWalletWrapper>
    </>
  );
}

function configureFromValues({
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
    args: [BigNumber.from(inputs.serviceRequestId), BigNumber.from(inputs.submissionId)],
  });
}
