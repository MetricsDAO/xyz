import { TxModal } from "~/components/tx-modal/tx-modal";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { ethers } from "ethers";
import { useState } from "react";
import { Button } from "../../components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { EvmAddress } from "~/domain/address";
import type { IOUCreationForm } from "./schema";
import { IOUCreationFormSchema } from "./schema";
import { Modal } from "../../components/modal";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { Input } from "../../components/input";
import { Select } from "../../components/select";

interface IOUCreatorProps {
  name: string;
  symbol: string;
  destinationChain: string;
  destinationAddress: EvmAddress;
  destinationDecimals: number;
}

// TODO: Where to keep the factory address?
// export function IOUCreator({ iouReceipt }: { iouReceipt: IOUCreatorProps }) {
export function IOUCreator() {
  const [openedCreate, setOpenedCreate] = useState(false);

  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<IOUCreationForm>({
  //     resolver: zodResolver(IOUCreationFormSchema),
  //   });

  const transactor = useTransactor({
    onSuccess: () => {
      console.log("IOU Success");
    },
  });

  const onOpenModal = () => {
    console.log("Open");
    setOpenedCreate(true);
  };

  const onSubmit = () => {
    console.log("Click");
    const iouReceipt = {
      name: "Test",
      symbol: "TEST",
      destinationChain: "SOL",
      destinationAddress: "0x47E38e585EbBBEC57F4FfeF222fb73B1E3A524bC" as EvmAddress,
      destinationDecimals: 18,
    };
    transactor.start({
      config: () => configureFromValues({ iouReceipt, factoryAddress: "0x47E38e585EbBBEC57F4FfeF222fb73B1E3A524bC" }),
    });
  };
  //   const startCreation = useCallback(() => {

  //   }, []);

  return (
    <>
      <Button onClick={onOpenModal}>Create iouToken</Button>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Create new iouToken">
        <form onSubmit={onSubmit}>
          <div className="space-y-5 mt-2">
            <p>The iouTokens will be created and can then be issued</p>
            <Select placeholder="Select a target Chain" options={[]} />
            <Select placeholder="Select a target Token" options={[]} />
            <Input label="iouToken Name" placeholder="iouToken Name" />
            <Input label="iouToken Symbol" placeholder="iouToken Symbol" />
            <div className="bg-amber-200/10 flex items-center rounded-md p-2">
              <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5" />
              <p className="text-yellow-700 text-sm">Ensure there is enough token liquidity before issuing</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
                Cancel
              </Button>
              <Button>Issue</Button>
            </div>
          </div>
        </form>
      </Modal>

      <TxModal
        transactor={transactor}
        title="Issue"
        confirmationMessage="Ensure there is enough token liquidity before issuing"
      />
    </>
  );
}

function configureFromValues({
  iouReceipt,
  factoryAddress,
}: {
  iouReceipt: IOUCreatorProps;
  factoryAddress: EvmAddress;
}) {
  const receipt = {
    ...iouReceipt,
    destinationDecimals: ethers.BigNumber.from(iouReceipt.destinationDecimals),
  };

  console.log("Formatted IOU receipt", receipt);

  return configureWrite({
    abi: PARTIAL_IOU_FACTORY_ABI,
    address: factoryAddress,
    functionName: "createIOU",
    args: [receipt],
  });
}

const PARTIAL_IOU_FACTORY_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "destinationChain",
            type: "string",
          },
          {
            internalType: "string",
            name: "destinationAddress",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "destinationDecimals",
            type: "uint256",
          },
        ],
        internalType: "struct IIOUFactory.Receipt",
        name: "_receipt",
        type: "tuple",
      },
    ],
    name: "createIOU",
    outputs: [
      {
        internalType: "contract IOU",
        name: "iou",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "iouId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
