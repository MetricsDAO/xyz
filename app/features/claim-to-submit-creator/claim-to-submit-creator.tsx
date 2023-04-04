import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";

interface ClaimToSubmitCreatorProps {
  serviceRequest: ServiceRequestWithIndexData;
  confirmationMessage: React.ReactNode;
}

export function ClaimToSubmitCreator({ confirmationMessage, serviceRequest }: ClaimToSubmitCreatorProps) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        navigate(`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}`);
      },
      [navigate, serviceRequest.laborMarketAddress, serviceRequest.id]
    ),
  });

  const onClick = () => {
    transactor.start({
      config: () => configureFromValues({ contracts, inputs: { serviceRequest } }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} title="Claim to Submit" confirmationMessage={confirmationMessage} />
      <ConnectWalletWrapper onClick={onClick}>
        <Button size="lg">Next</Button>
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
    serviceRequest: ServiceRequestWithIndexData;
  };
}) {
  return configureWrite({
    abi: contracts.LaborMarket.abi,
    address: inputs.serviceRequest.laborMarketAddress,
    functionName: "signal",
    args: [BigNumber.from(inputs.serviceRequest.id)],
  });
}
