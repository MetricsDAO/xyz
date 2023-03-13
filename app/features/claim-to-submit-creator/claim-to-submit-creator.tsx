import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { LaborMarketDoc, ServiceRequestDoc } from "~/domain";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";

interface ClaimToSubmitCreatorProps {
  serviceRequest: ServiceRequestDoc;
  lockAmount: string;
}

export function ClaimToSubmitCreator({ lockAmount, serviceRequest }: ClaimToSubmitCreatorProps) {
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        navigate(`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}/submit`);
      },
      [navigate, serviceRequest.laborMarketAddress, serviceRequest.id]
    ),
  });

  const onClick = () => {
    transactor.start({
      config: () => configureFromValues({ serviceRequest }),
    });
  };

  // connect wallet wrapper?
  return (
    <>
      <TxModal
        transactor={transactor}
        title="Claim to Submit"
        confirmationMessage={
          <div className="space-y-8">
            <p className="mt-2">Please confirm that you would like to claim a submission.</p>
            <p>
              This will lock <b>{lockAmount} rMETRIC.</b>
            </p>
          </div>
        }
      />
      <Button size="lg" onClick={onClick}>
        Claim to Submit
      </Button>
    </>
  );
}

function configureFromValues({ serviceRequest }: { serviceRequest: ServiceRequestDoc }) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: serviceRequest.laborMarketAddress as `0x${string}`,
    functionName: "signal",
    args: [BigNumber.from(serviceRequest.id)],
  });
}
