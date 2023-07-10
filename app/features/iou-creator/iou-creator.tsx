import { zodResolver } from "@hookform/resolvers/zod";
import type { Network } from "@prisma/client";
import type { BigNumber } from "ethers";
import { ethers } from "ethers";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { iouFactoryAbi, iouFactoryAddress } from "~/abi/iou-factory";
import { Error, Field, Input, Label, Modal, Select } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { postIouToken } from "~/utils/fetch";
import { getEventFromLogs } from "~/utils/helpers";
import { Button } from "../../components/button";
import type { IOUCreationForm } from "./schema";
import { IOUCreationFormSchema } from "./schema";
import toast from "react-hot-toast";

export interface IOUCreatorArgs {
  name: string;
  symbol: string;
  destinationChain: string;
  destinationAddress: EvmAddress;
  destinationDecimals: BigNumber;
}

export function IOUCreator({ networks }: { networks: Network[] }) {
  const [openedCreate, setOpenedCreate] = useState(false);

  const methods = useForm<IOUCreationForm>({
    resolver: zodResolver(IOUCreationFormSchema),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const transactor = useTransactor({
    onSuccess: (receipt) => {
      console.log("IOU Success", receipt);
      // parse event logs for contract address
      const iface = new ethers.utils.Interface(iouFactoryAbi);
      const event = getEventFromLogs(iouFactoryAddress, iface, receipt.logs, "IOUCreated");

      if (event) {
        const [iouAddress] = event.args;
        const values = methods.getValues();

        const postMetaData = {
          ...values,
          iouTokenAddresses: Array.of(iouAddress),
        };
        postIouToken(postMetaData);
      }
      toast.success("Successfully added IOU Token");
    },
  });

  const onSubmit = (data: IOUCreationForm) => {
    console.log("submit", data);
    console.log("methods", methods);
    const values = methods.getValues();
    console.log("values", values);
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
    <FormProvider {...methods}>
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
                <Input {...register("destinationAddress")} label="Target Address" placeholder="Target Address" />
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
            <Input
              {...register("destinationDecimals", { valueAsNumber: true })}
              label="Decimals"
              placeholder="Decimals"
            />
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
    </FormProvider>
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
    abi: iouFactoryAbi,
    address: factoryAddress,
    functionName: "createIOU",
    args: [receipt],
  });
}
