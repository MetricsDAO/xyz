import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { Button } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import ConnectWalletWrapper from "./connect-wallet-wrapper";

export function IOUTokenCreator() {
  const contracts = useContracts();
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback((receipt) => {
      // navigate(`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}`);
    }, []),
  });

  const onClick = () => {
    transactor.start({
      config: () => configureFromValues({ contracts }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} title="create IOU" confirmationMessage={"DO IT"} />

      <ConnectWalletWrapper onClick={onClick}>
        <Button size="lg">Create IOU</Button>
      </ConnectWalletWrapper>
    </>
  );
}

function configureFromValues({ contracts }: { contracts: ReturnType<typeof useContracts> }) {
  return configureWrite({
    abi: ABI,
    address: "0x47E38e585EbBBEC57F4FfeF222fb73B1E3A524bC",
    functionName: "createIOU",
    args: [
      {
        name: "Sebs IOU",
        symbol: "SEB",
        destinationChain: "0x1",
        destinationAddress: "0x123",
        destinationDecimals: BigNumber.from(18),
      },
    ],
  });
}

const ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "string", name: "destinationChain", type: "string" },
          { internalType: "string", name: "destinationAddress", type: "string" },
          { internalType: "uint256", name: "destinationDecimals", type: "uint256" },
        ],
        internalType: "struct IIOUFactory.Receipt",
        name: "_receipt",
        type: "tuple",
      },
    ],
    name: "createIOU",
    outputs: [
      { internalType: "contract IOU", name: "iou", type: "address" },
      { internalType: "uint256", name: "iouId", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
