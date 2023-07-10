import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Field, Input, Label, Modal, Error } from "~/components";
import { AddTokenFormSchema, type AddTokenForm } from "./schema";
import { createToken } from "~/domain/treasury";

export function AddTokenButton() {
  const [openedCreate, setOpenedCreate] = useState(false);

  const methods = useForm<AddTokenForm>({
    resolver: zodResolver(AddTokenFormSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (formValues: AddTokenForm) => {
    createToken(
      formValues.tokenName,
      "Polygon",
      formValues.decimals,
      formValues.contractAddress,
      formValues.tokenSymbol,
      false
    );
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
              <Input label="Token Name" placeholder="Token name" />
              <Error error={errors.tokenName?.message} />
            </Field>
            <Field>
              <Label>Token Symbol</Label>
              <Input label="Token Symbol" placeholder="Symbol" />
              <Error error={errors.tokenSymbol?.message} />
            </Field>
            <Field>
              <Label>Contract Address</Label>
              <Input label="Contract Address" placeholder="contract address" />
              <Error error={errors.contractAddress?.message} />
            </Field>
            <Field>
              <Label>Decimals</Label>
              <Input label="Decimals" placeholder="decimals" />
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
