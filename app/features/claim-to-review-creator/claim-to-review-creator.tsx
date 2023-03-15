import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ServiceRequestDoc } from "~/domain/service-request/schemas";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { REPUTATION_REVIEW_SIGNAL_STAKE } from "~/utils/constants";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import { ClaimToReviewCreatorFields } from "./claim-to-review-creator-fields";
import type { ClaimToReviewFormValues } from "./claim-to-review-creator-values";
import { ClaimToReviewFormValuesSchema } from "./claim-to-review-creator-values";

interface ClaimToReviewFormProps {
  serviceRequest: ServiceRequestDoc;
}

export function ClaimToReviewCreator({ serviceRequest }: ClaimToReviewFormProps) {
  const methods = useForm<ClaimToReviewFormValues>({
    resolver: zodResolver(ClaimToReviewFormValuesSchema),
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        navigate(`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}`);
      },
      [navigate, serviceRequest.laborMarketAddress, serviceRequest.id]
    ),
  });

  const onSubmit = (formValues: ClaimToReviewFormValues) => {
    transactor.start({
      config: () => configureFromValues({ serviceRequest, formValues }),
    });
  };

  return (
    <FormProvider {...methods}>
      <TxModal
        transactor={transactor}
        title="Claim to Review"
        confirmationMessage={
          <div className="space-y-8">
            <p className="mt-2">
              Please confirm that you would like to claim {methods.getValues("quantity")} submissions to review.
            </p>
            <p>
              This will lock <b>{Number(methods.getValues("quantity")) * REPUTATION_REVIEW_SIGNAL_STAKE} rMETRIC.</b>
            </p>
          </div>
        }
      />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto px-10 max-w-4xl space-y-7 mb-12">
        <ClaimToReviewCreatorFields serviceRequest={serviceRequest} />
        <div className="flex flex-col sm:flex-row gap-5">
          <ConnectWalletWrapper>
            <Button size="lg" type="submit">
              Next
            </Button>
          </ConnectWalletWrapper>
          <Button size="lg" variant="cancel" asChild>
            <Link to={`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

function configureFromValues({
  serviceRequest,
  formValues,
}: {
  serviceRequest: ServiceRequestDoc;
  formValues: ClaimToReviewFormValues;
}) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: serviceRequest.laborMarketAddress as `0x${string}`,
    functionName: "signalReview",
    args: [BigNumber.from(serviceRequest.id), BigNumber.from(formValues.quantity)],
  });
}
