import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { scoreToLabel } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "../../components/button";
import { ReviewCreatorFields } from "./review-creator-fields";
import type { ReviewFormValues } from "./review-creator-values";
import { ReviewFormValuesSchema } from "./review-creator-values";

interface ReviewFormProps {
  laborMarketAddress: string;
  submissionId: string;
  requestId: string;
  onCancel: () => void;
}

export function ReviewCreator({ laborMarketAddress, submissionId, requestId, onCancel }: ReviewFormProps) {
  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormValuesSchema),
    defaultValues: {
      score: 2, // default to an average score
    },
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        // reload the page
        navigate(0);
      },
      [navigate]
    ),
  });

  const onSubmit = (formValues: ReviewFormValues) => {
    transactor.start({
      config: () =>
        configureFromValues({
          laborMarketAddress: laborMarketAddress as `0x${string}`,
          submissionId,
          requestId,
          formValues,
        }),
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
  laborMarketAddress,
  formValues,
  submissionId,
  requestId,
}: {
  laborMarketAddress: `0x${string}`;
  submissionId: string;
  requestId: string;
  formValues: ReviewFormValues;
}) {
  return configureWrite({
    address: laborMarketAddress,
    abi: LaborMarket.abi,
    functionName: "review",
    args: [BigNumber.from(requestId), BigNumber.from(submissionId), BigNumber.from(formValues.score)],
  });
}
