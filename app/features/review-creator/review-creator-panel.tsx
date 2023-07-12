import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import DOMPurify from "dompurify";
import { BigNumber } from "ethers";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClientOnly } from "remix-utils";
import { useAccount } from "wagmi";
import { Button, Field, UserBadge, scoreToLabel } from "~/components";
import { MarkdownEditor, ParsedMarkdown } from "~/components/markdown-editor/markdown.client";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ReviewDoc, SubmissionWithReviewsDoc } from "~/domain";
import { ReviewAppDataSchema } from "~/domain";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { SCORE_COLOR } from "~/utils/constants";
import { dateHasPassed, fromNow } from "~/utils/date";
import ConnectWalletWrapper from "../connect-wallet-wrapper";
import type { ReviewFormValues } from "./review-creator-values";
import { ReviewFormValuesSchema } from "./review-creator-values";
import type { ServiceRequestDoc } from "~/domain/service-request/schemas";

export function ReviewCreatorPanel({
  submission,
  onCancel,
  serviceRequest,
}: {
  submission: SubmissionWithReviewsDoc;
  onCancel: () => void;
  serviceRequest: ServiceRequestDoc | null;
}) {
  const { laborMarketAddress, reviews, serviceRequestId, id } = submission;
  const contracts = useContracts();
  const account = useAccount();

  const { watch, register, setValue, getValues, handleSubmit } = useForm<ReviewFormValues>({
    defaultValues: {
      score: 50, // default to average
      comment: "",
    },
    resolver: zodResolver(ReviewFormValuesSchema),
  });

  const userHasReviewed = (reviews: ReviewDoc[]): boolean => {
    return reviews.some((review) => review.reviewer === account.address);
  };

  const alreadyReviewed = userHasReviewed(reviews);
  const reviewDeadlineNotPassed = serviceRequest && !dateHasPassed(serviceRequest.configuration.signalExp);
  const isCurrentUsersSubmission = submission.configuration.fulfiller === account.address;

  const canSubmitReview = !alreadyReviewed && reviewDeadlineNotPassed && !isCurrentUsersSubmission;

  const selectedScore = watch("score");

  const transactor = useTransactor({
    onSuccess: (receipt) => {
      toast.success("Successfully reviewed submission. Please check back in a few moments.");
    },
  });

  const onSubmit = (formValues: ReviewFormValues) => {
    const metadata = ReviewAppDataSchema.parse(formValues);
    transactor.start({
      metadata: metadata,
      config: ({ cid }) =>
        configureFromValues({
          contracts,
          inputs: { laborMarketAddress, submissionId: id, serviceRequestId, formValues, cid },
        }),
    });
  };

  function configureFromValues({
    contracts,
    inputs,
  }: {
    contracts: ReturnType<typeof useContracts>;
    inputs: {
      laborMarketAddress: EvmAddress;
      submissionId: string;
      serviceRequestId: string;
      formValues: ReviewFormValues;
      cid: string;
    };
  }) {
    const { laborMarketAddress, submissionId, serviceRequestId, formValues, cid } = inputs;
    return configureWrite({
      address: laborMarketAddress,
      abi: contracts.LaborMarket.abi,
      functionName: "review",
      args: [BigNumber.from(serviceRequestId), BigNumber.from(submissionId), BigNumber.from(formValues.score), cid], //TODO cid
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TxModal
        transactor={transactor}
        title="Review & Score"
        confirmationMessage={
          <p>
            Please confirm that you would like to give this submission a score of
            <b>{` ${scoreToLabel(getValues("score"))}`}</b>.
          </p>
        }
      />
      <div className="h-screen">
        <div className="flex border justify-between bg-white p-3">
          <div className="flex space-x-4 items-center">
            <p>
              {submission?.configuration.fulfiller ? <UserBadge address={submission?.configuration.fulfiller} /> : null}
            </p>
            {submission?.blockTimestamp ? <p> {fromNow(submission?.blockTimestamp)}</p> : null}
          </div>
        </div>
        <div
          className={`space-y-4 bg-blue-300 bg-opacity-10 p-10 overflow-y-auto  ${
            canSubmitReview ? "h-3/5" : "h-full"
          }`}
        >
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div
                key={fromNow(r.blockTimestamp) ?? fromNow(r.indexedAt)}
                className="bg-white border rounded-md p-6 space-y-3"
              >
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <p>
                      <UserBadge address={r.reviewer} />
                    </p>
                    <p className="text-stone-500 text-sm">{}</p>
                  </div>
                  <div
                    className={clsx(
                      SCORE_COLOR[scoreToLabel(Number(r.score))],
                      "flex w-24 h-9 justify-center items-center rounded-lg text-sm"
                    )}
                  >
                    <p>{scoreToLabel(Number(r.score))}</p>
                  </div>
                </div>
                <p className="text-sm">
                  <ClientOnly>{() => <ParsedMarkdown text={DOMPurify.sanitize(r.appData.comment ?? "")} />}</ClientOnly>
                </p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center align-middle">
              <p> Be the first to review! </p>
            </div>
          )}
        </div>
        {canSubmitReview && (
          <div className="border bg-white p-4 space-y-4 h-1/3 overflow-y-auto">
            <div className="flex flex-row gap-4 justify-between">
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 100)}
                className={clsx("hover:bg-lime-100", {
                  "bg-lime-100": selectedScore === 100,
                })}
              >
                Stellar
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 75)}
                className={clsx("hover:bg-blue-200", {
                  "bg-blue-200": selectedScore === 75,
                })}
              >
                Good
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 50)}
                className={clsx("hover:bg-neutral-200", {
                  "bg-neutral-200": selectedScore === 50,
                })}
              >
                Average
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 25)}
                className={clsx("hover:bg-orange-200", {
                  "bg-orange-200": selectedScore === 25,
                })}
              >
                Bad
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 0)}
                className={clsx("hover:bg-rose-200", {
                  "bg-rose-200": selectedScore === 0,
                })}
              >
                Spam
              </Button>
              <input type="hidden" {...register("score")} />
            </div>
            <Field>
              <ClientOnly>
                {() => (
                  <div className="container overflow-auto">
                    <MarkdownEditor
                      {...register("comment")}
                      value={watch("comment")}
                      onChange={(v) => {
                        setValue("comment", v ?? "");
                      }}
                    />
                  </div>
                )}
              </ClientOnly>
            </Field>
            <div className="flex gap-3 justify-end">
              <Button className="max-w-fit" type="button" variant="cancel" fullWidth onClick={onCancel}>
                Cancel
              </Button>
              <ConnectWalletWrapper>
                <Button type="submit">Submit Score</Button>
              </ConnectWalletWrapper>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
