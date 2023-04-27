import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback, useState } from "react";
import { Button, Modal } from "~/components";
import { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import ConnectWalletWrapper from "./connect-wallet-wrapper";

export default function DeleteServiceRequestModal({ serviceRequest }: { serviceRequest: ServiceRequestWithIndexData }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="border border-neutral-200 p-2.5 rounded cursor-pointer" onClick={() => setOpen(true)}>
        <TrashIcon className="text-gray-500 h-6 w-6" />
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} closeButton={false}>
        <div>
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto my-4" />
          <h3 className="text-base text-center font-medium">Are you sure you want to delete this Challenge?</h3>
          <p className="text-center text-sm text-stone-500 mb-6 mt-2">
            All information will be removed and you will not be able to retrieve it.
          </p>
          <div className="flex gap-2">
            <Button variant="cancel" fullWidth={true}>
              Cancel
            </Button>
            <ServiceRequestDelete serviceRequest={serviceRequest} />
          </div>
        </div>
      </Modal>
    </>
  );
}

function ServiceRequestDelete({ serviceRequest }: { serviceRequest: ServiceRequestWithIndexData }) {
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
    console.log("hit");
    transactor.start({
      config: () => configureFromValues({ contracts, inputs: { serviceRequest } }),
    });
  };

  return (
    <>
      <ConnectWalletWrapper onClick={onClick}>
        <Button variant="danger" fullWidth={true}>
          Delete
        </Button>
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
    functionName: "withdrawRequest",
    args: [BigNumber.from(inputs.serviceRequest.id)],
  });
}
