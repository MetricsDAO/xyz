import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Error, Field, Input, Label, Modal } from "~/components";
import { postToken } from "~/utils/fetch";
import { AddTokenFormSchema, type AddTokenForm } from "./schema";

export function AddTokenButton() {
  const [openedCreate, setOpenedCreate] = useState(false);

  const methods = useForm<AddTokenForm>({
    resolver: zodResolver(AddTokenFormSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (formValues: AddTokenForm) => {
    const data = {
      name: formValues.tokenName,
      symbol: formValues.tokenSymbol,
      destinationChain: "polygon",
      destinationAddress: formValues.contractAddress,
      destinationDecimals: formValues.decimals,
      isIouToken: false,
    };
    postToken(data);
    setOpenedCreate(false);
    toast.success("Token successfully created");
  };

  return (
    <FormProvider {...methods}>
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
              <Input {...register("tokenName")} label="Token Name" placeholder="Token name" />
              <Error error={errors.tokenName?.message} />
            </Field>
            <Field>
              <Label>Token Symbol</Label>
              <Input {...register("tokenSymbol")} label="Token Symbol" placeholder="Symbol" />
              <Error error={errors.tokenSymbol?.message} />
            </Field>
            <Field>
              <Label>Contract Address</Label>
              <Input {...register("contractAddress")} label="Contract Address" placeholder="contract address" />
              <Error error={errors.contractAddress?.message} />
            </Field>
            <Field>
              <Label>Decimals</Label>
              <Input {...register("decimals", { valueAsNumber: true })} label="Decimals" placeholder="decimals" />
              <Error error={errors.decimals?.message} />
            </Field>
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>Add</Button>
            </div>
          </div>
        </form>
      </Modal>
    </FormProvider>
  );
}
