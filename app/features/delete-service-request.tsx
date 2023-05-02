import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback, useState } from "react";
import { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import ConnectWalletWrapper from "./connect-wallet-wrapper";
import { TxModal } from "~/components/tx-modal/tx-modal";

export default function DeleteServiceRequestModal({ serviceRequest }: { serviceRequest: ServiceRequestWithIndexData }) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        navigate(`/app/market/${serviceRequest.laborMarketAddress}`);
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
      <ConnectWalletWrapper onClick={onClick}>
        <div className="border border-neutral-200 p-2.5 rounded cursor-pointer">
          <TrashIcon className="text-gray-500 h-6 w-6" />
        </div>
      </ConnectWalletWrapper>
      <TxModal
        transactor={transactor}
        variant="danger"
        title=""
        confirmationMessage={
          <>
            <h3 className="text-base text-center font-medium">Are you sure you want to delete this Challenge?</h3>
            <p className="text-center text-sm text-stone-500 mb-6 mt-2">
              All information will be removed and you will not be able to retrieve it.
            </p>
          </>
        }
      />
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
    functionName: "withdrawRequest",
    args: [BigNumber.from(inputs.serviceRequest.id)],
  });
}
