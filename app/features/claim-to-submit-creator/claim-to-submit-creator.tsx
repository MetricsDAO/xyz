import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";

interface ClaimToSubmitCreatorProps {
  serviceRequest: ServiceRequestWithIndexData;
  confirmationMessage: React.ReactNode;
}

export function ClaimToSubmitCreator({ confirmationMessage, serviceRequest }: ClaimToSubmitCreatorProps) {
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
      config: () => configureFromValues({ serviceRequest }),
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

function configureFromValues({ serviceRequest }: { serviceRequest: ServiceRequestWithIndexData }) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: serviceRequest.laborMarketAddress as `0x${string}`,
    functionName: "signal",
    args: [BigNumber.from(serviceRequest.id)],
  });
}
