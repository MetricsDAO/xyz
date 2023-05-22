import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";

interface ClaimRewardCreatorProps {
  disabled: boolean;
  laborMarketAddress: EvmAddress;
  submissionId: string;
  payoutAddress: EvmAddress;
  confirmationMessage?: React.ReactNode;
}

export function ClaimRewardCreator({
  disabled,
  laborMarketAddress,
  submissionId,
  payoutAddress,
  confirmationMessage,
}: ClaimRewardCreatorProps) {
  const contracts = useContracts();
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
      config: () => configureFromValues({ contracts, inputs: { laborMarketAddress, submissionId, payoutAddress } }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} title="Claim your reward!" confirmationMessage={confirmationMessage} />
      <ConnectWalletWrapper onClick={onClick}>
        <Button disabled={disabled}>Claim</Button>
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
