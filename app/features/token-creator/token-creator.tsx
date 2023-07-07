import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import type { Network } from "@prisma/client";
import { ethers } from "ethers";
import { useState } from "react";
import { Button, Field, Input, Label, Modal } from "~/components";
import type { EvmAddress } from "~/domain/address";
import type { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import type { AddTokenForm } from "./schema";

export function AddTokenButton() {
  const [openedCreate, setOpenedCreate] = useState(false);

  const transactor = useTransactor({
    onSuccess: () => {
      console.log("Success");
    },
  });

  const onSubmit = () => {
    /*transactor.start({
      config: () => configureFromValues({ tokenReceipt, factoryAddress: "0x47E38e585EbBBEC57F4FfeF222fb73B1E3A524bC" }),
    });*/
  };

  return (
    <>
      <Button onClick={() => setOpenedCreate(true)}>Add Token</Button>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Add new Token">
        <form>
          <div className="space-y-5 mt-2">
            <div className="bg-amber-200/10 flex items-center rounded-md p-2">
              <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5" />
              <p className="text-yellow-700 text-sm">For tokens on polygon only</p>
            </div>
            <Field>
              <Label>Token Name</Label>
              <Input label="Token Name" placeholder="Token name" />
            </Field>
            <Field>
              <Label>Token Symbol</Label>
              <Input label="Token Symbol" placeholder="Symbol" />
            </Field>
            <Field>
              <Label>Contract Address</Label>
              <Input label="Contract Address" placeholder="contract address" />
            </Field>
            <Field>
              <Label>Decimals</Label>
              <Input label="Decimals" placeholder="decimals" />
            </Field>
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
                Cancel
              </Button>
              <Button>Add</Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

function configureFromValues({
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    formValues: AddTokenForm;
  };
}) {
  /*return configureWrite({
    abi: todo,
    address: factoryAddress,
    functionName: "createIOU",
    args: [],
  });*/
}
