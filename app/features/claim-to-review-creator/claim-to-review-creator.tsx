import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ServiceRequestWithIndexData } from "~/domain/service-request/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { REPUTATION_REVIEW_SIGNAL_STAKE } from "~/utils/constants";
import { Button } from "../../components/button";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import { ClaimToReviewCreatorFields } from "./claim-to-review-creator-fields";
import type { ClaimToReviewFormValues } from "./claim-to-review-creator-values";
import { ClaimToReviewFormValuesSchema } from "./claim-to-review-creator-values";

interface ClaimToReviewFormProps {
  serviceRequest: ServiceRequestWithIndexData;
}

export function ClaimToReviewCreator({ serviceRequest }: ClaimToReviewFormProps) {
  const contracts = useContracts();
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
      config: () => configureFromValues({ contracts, inputs: { serviceRequest, formValues } }),
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
            <Link
              to={`/app/market/${serviceRequest.laborMarketAddress}/request/${serviceRequest.id}}`}
              state={{ crumbs: "market" }}
            >
              Cancel
            </Link>
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
    formValues: ClaimToReviewFormValues;
    serviceRequest: ServiceRequestWithIndexData;
  };
}) {
  return configureWrite({
    abi: contracts.LaborMarket.abi,
    address: inputs.serviceRequest.laborMarketAddress,
    functionName: "signalReview",
    args: [BigNumber.from(inputs.serviceRequest.id), BigNumber.from(inputs.formValues.quantity)],
  });
}
