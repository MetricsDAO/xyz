import { TxModal } from "~/components/tx-modal/tx-modal";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { ethers } from "ethers";
import { useState } from "react";
import { Button } from "../../components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IOUCreationFormSchema } from "./schema";
import { Modal, Field, Label, Select, Input } from "~/components";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import type { EvmAddress } from "~/domain/address";
import type { IOUCreationForm } from "./schema";
import type { Network } from "@prisma/client";
interface IOUCreatorProps {
  name: string;
  symbol: string;
  destinationChain: string;
  destinationAddress: EvmAddress;
  destinationDecimals: number;
}

// TODO: Where to keep the factory address?
export function IOUCreator({ networks }: { networks: Network[] }) {
  const [openedCreate, setOpenedCreate] = useState(false);

  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<IOUCreationForm>({
  //     resolver: zodResolver(IOUCreationFormSchema),
  //   });

  const validAddress = true;

  const transactor = useTransactor({
    onSuccess: () => {
      console.log("IOU Success");
    },
  });

  const onSubmit = () => {
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

  return (
    <>
      <Button onClick={() => setOpenedCreate(true)}>Create iouToken</Button>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Create new iouToken">
        <form className="space-y-5 mt-2">
          <p>The tokens will be created and can then be issued</p>
          <Field>
            <Label>Target Chain</Label>
            <Select
              placeholder="Select a Target Chain"
              onChange={(v) => {}}
              options={networks.map((n) => {
                return { label: n.name, value: n.name };
              })}
            />
          </Field>
          <Field>
            <Label>iouToken Name</Label>
            <Input label="iouToken Name" placeholder="iouToken Name" />
          </Field>
          <Field>
            <Label>Decimals</Label>
            <Input label="Decimals" placeholder="Decimals" />
          </Field>
          <Field>
            <Label>Fireblocks Token Name</Label>
            <Input label="Fireblocks Name" placeholder="Fireblocks Name" />
          </Field>
          <Field>
            <Label>Contract Address</Label>
            <Input label="Contract Address" placeholder="Contract Address" />
          </Field>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
              Cancel
            </Button>
            <Button disabled={!validAddress}>Save</Button>
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
