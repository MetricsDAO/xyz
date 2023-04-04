import { zodResolver } from "@hookform/resolvers/zod";
import { BigNumber } from "ethers";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { scoreToLabel } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import { ReviewCreatorFields } from "./review-creator-fields";
import type { ReviewFormValues } from "./review-creator-values";
import { ReviewFormValuesSchema } from "./review-creator-values";

interface ReviewFormProps {
  laborMarketAddress: EvmAddress;
  submissionId: string;
  requestId: string;
  onCancel: () => void;
}

export function ReviewCreator({ laborMarketAddress, submissionId, requestId, onCancel }: ReviewFormProps) {
  const contracts = useContracts();
  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormValuesSchema),
    defaultValues: {
      score: 2, // default to an average score
    },
  });

  const transactor = useTransactor({
    onSuccess: (receipt) => {
      onCancel();
      toast.success("Successfully reviewed submission. Please check back in a few moments.");
    },
  });

  const onSubmit = (formValues: ReviewFormValues) => {
    transactor.start({
      config: () =>
        configureFromValues({ contracts, inputs: { laborMarketAddress, submissionId, requestId, formValues } }),
    });
  };

  return (
    <FormProvider {...methods}>
      <TxModal
        transactor={transactor}
        title="Review & Score"
        confirmationMessage={
          <p>
            Please confirm that you would like to give this submission a score of
            <b>{` ${scoreToLabel(methods.getValues("score") * 25)}`}</b>.
          </p>
        }
      />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto px-10 max-w-4xl space-y-7 mb-12">
        <ReviewCreatorFields />
        <div className="flex gap-2 w-full">
          <Button type="button" variant="cancel" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" fullWidth>
            Submit Score
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

function configureFromValues({
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    laborMarketAddress: EvmAddress;
    submissionId: string;
    requestId: string;
    formValues: ReviewFormValues;
  };
}) {
  const { laborMarketAddress, submissionId, requestId, formValues } = inputs;
  return configureWrite({
    address: laborMarketAddress,
    abi: contracts.LaborMarket.abi,
    functionName: "review",
    args: [BigNumber.from(requestId), BigNumber.from(submissionId), BigNumber.from(formValues.score)],
  });
}
