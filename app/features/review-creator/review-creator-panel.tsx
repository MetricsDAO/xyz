import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { BigNumber } from "ethers";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClientOnly } from "remix-utils";
import { Button, Field, UserBadge, scoreToLabel } from "~/components";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { TxModal } from "~/components/tx-modal/tx-modal";
import type { ReviewDoc, SubmissionWithReviewsDoc } from "~/domain";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { SCORE_COLOR } from "~/utils/constants";
import { fromNow } from "~/utils/date";
import type { ReviewFormValues } from "./review-creator-values";
import { ReviewFormValuesSchema } from "./review-creator-values";

export function ReviewCreatorPanel({
  onStateChange,
  reviews,
  submission,
  onCancel,
  laborMarketAddress,
  submissionId,
  requestId,
}: {
  onStateChange: (state: boolean) => void;
  reviews: ReviewDoc[];
  laborMarketAddress: EvmAddress;
  submissionId: string;
  requestId: string;
  submission?: SubmissionWithReviewsDoc;
  onCancel: () => void;
}) {
  const contracts = useContracts();
  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormValuesSchema),
    defaultValues: {
      score: 2, // default to an average score
      comment: "",
    },
  });

  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>();

  const selectedScore = watch("score");

  const transactor = useTransactor({
    onSuccess: (receipt) => {
      onCancel();
      toast.success("Successfully reviewed submission. Please check back in a few moments.");
    },
  });

  const onSubmit = (formValues: ReviewFormValues) => {
    const metadata = { comment: formValues.comment };
    transactor.start({
      metadata: metadata,
      config: ({ account, cid }) =>
        configureFromValues({ contracts, inputs: { laborMarketAddress, submissionId, requestId, formValues, cid } }),
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
      requestId: string;
      formValues: ReviewFormValues;
      cid: string;
    };
  }) {
    const { laborMarketAddress, submissionId, requestId, formValues, cid } = inputs;
    console.log("INPUTS", inputs);
    return configureWrite({
      address: laborMarketAddress,
      abi: contracts.LaborMarket.abi,
      functionName: "review",
      args: [BigNumber.from(requestId), BigNumber.from(submissionId), BigNumber.from(formValues.score), cid], //TODO cid
    });
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="mx-auto max-w-4xl space-y-7 mt-16 fixed top-0 right-0 w-1/2"
      >
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
        <div className="mx-auto max-w-2xl h-screen">
          <div className="flex border justify-between bg-white p-3">
            <div className="flex space-x-4 items-center">
              <div className="flex gap-2 items-center">
                {/* <div className="bg-gray-100 p-1 rounded-full">
                  <ChevronLeftIcon className="text-black h-4" />
                </div> */}
                {/* <p className="text-sm">4/25</p> */}
                {/* <div className="bg-gray-100 p-1 rounded-full">
                  <ChevronRightIcon className="text-black h-4" />
                </div> */}
              </div>
              <p>
                {submission?.configuration.fulfiller ? (
                  <UserBadge address={submission?.configuration.fulfiller} />
                ) : null}
              </p>
              {submission?.blockTimestamp ? <p> {fromNow(submission?.blockTimestamp)}</p> : null}
            </div>
            <div onClick={() => onStateChange(false)} className="flex gap-px items-center">
              <ArrowRightIcon onClick={() => onStateChange(false)} className="text-black h-4" />
              <div className="bg-black h-4 w-px" />
            </div>
          </div>
          <div className="space-y-4 bg-blue-300 p-10 overflow-y-auto h-3/5">
            {reviews.map((r) => (
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
                      SCORE_COLOR[scoreToLabel(Number(r.score) * 25)],
                      "flex w-24 h-9 justify-center items-center rounded-lg text-sm"
                    )}
                  >
                    <p>{scoreToLabel(Number(r.score) * 25)}</p>
                  </div>
                </div>
                <p className="text-stone-500 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
          <div className="border bg-white p-4 space-y-4 h-1/3 overflow-y-auto">
            <div className="flex flex-row gap-4 justify-between">
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 4)}
                className={clsx("hover:bg-lime-100", {
                  "bg-lime-100": selectedScore === 4,
                })}
              >
                Stellar
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 3)}
                className={clsx("hover:bg-blue-200", {
                  "bg-blue-200": selectedScore === 3,
                })}
              >
                Good
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 2)}
                className={clsx("hover:bg-neutral-200", {
                  "bg-neutral-200": selectedScore === 2,
                })}
              >
                Average
              </Button>
              <Button
                fullWidth
                variant="gray"
                type="button"
                onClick={() => setValue("score", 1)}
                className={clsx("hover:bg-orange-200", {
                  "bg-orange-200": selectedScore === 1,
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
              <Button variant="cancel">Cancel</Button>
              <Button type="submit">Submit Score</Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
