import { TxModal } from "~/components/tx-modal/tx-modal";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "../../components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { IOUCreationFormSchema } from "./schema";
import { Modal, Field, Label, Select, Input, Error } from "~/components";
import { getEventFromLogs } from "~/utils/helpers";
import type { EvmAddress } from "~/domain/address";
import type { IOUCreationForm } from "./schema";
import type { Network, Token } from "@prisma/client";
import type { BigNumber } from "ethers";

interface IOUCreatorArgs {
  name: string;
  symbol: string;
  destinationChain: string;
  destinationAddress: EvmAddress;
  destinationDecimals: BigNumber;
}

export function IOUCreator({ networks, targetTokens }: { networks: Network[]; targetTokens: Token[] }) {
  const [openedCreate, setOpenedCreate] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOUCreationForm>({
    resolver: zodResolver(IOUCreationFormSchema),
  });

  // TODO: Where to keep the factory address?
  const iouFactoryAddress = "0x47E38e585EbBBEC57F4FfeF222fb73B1E3A524bC";

  const transactor = useTransactor({
    onSuccess: (receipt) => {
      console.log("IOU Success", receipt);
      // parse event logs for contract address
      const iface = new ethers.utils.Interface(PARTIAL_IOU_FACTORY_ABI);
      const event = getEventFromLogs(iouFactoryAddress, iface, receipt.logs, "IOUCreated");

      if (event) {
        // need to double check this
        const [iouAddress, iouId] = event.args;
        // post metadata request to treasury
        // add token to mongo
      }
    },
  });

  const onSubmit = (data: IOUCreationForm) => {
    console.log("submit", data);
    const iouReceipt: IOUCreatorArgs = {
      name: data.name,
      symbol: data.symbol,
      destinationChain: data.destinationChain,
      destinationAddress: data.destinationAddress as EvmAddress,
      destinationDecimals: ethers.BigNumber.from(data.destinationDecimals),
    };

    transactor.start({
      config: () => configureFromValues({ iouReceipt, factoryAddress: iouFactoryAddress }),
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
            <Error error={errors.destinationChain?.message} />
            <Controller
              control={control}
              name="destinationChain"
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select a Target Chain"
                  options={networks.map((n) => {
                    return { label: n.name, value: n.name };
                  })}
                />
              )}
            />
          </Field>
          <Field>
            <Label>Target Token</Label>
            <Error error={errors.destinationAddress?.message} />
            <Controller
              control={control}
              name="destinationAddress"
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select a Target Token"
                  options={targetTokens.map((t) => {
                    return { label: t.name, value: t.name };
                  })}
                />
              )}
            />
          </Field>
          <Field>
            <Label>iouToken Name</Label>
            <Error error={errors.name?.message} />
            <Input {...register("name")} label="iouToken Name" placeholder="iouToken Name" />
          </Field>
          <Field>
            <Label>iouToken Symbol</Label>
            <Error error={errors.symbol?.message} />
            <Input {...register("symbol")} label="iouToken Symbol" placeholder="iouToken Symbol" />
          </Field>
          <Field>
            <Label>Decimals</Label>
            <Error error={errors.destinationDecimals?.message} />
            <Input {...register("destinationDecimals")} label="Decimals" placeholder="Decimals" />
          </Field>
          <Field>
            <Label>Fireblocks Token Name</Label>
            <Error error={errors.fireblocksTokenName?.message} />
            <Input {...register("fireblocksTokenName")} label="Fireblocks Name" placeholder="Fireblocks Name" />
          </Field>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
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
  iouReceipt: IOUCreatorArgs;
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
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IOU",
        name: "iou",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "iouId",
        type: "uint256",
      },
    ],
    name: "IOUCreated",
    type: "event",
  },
] as const;
