import { zodResolver } from "@hookform/resolvers/zod";
import type { Token } from "@prisma/client";
import { BigNumber } from "ethers";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import { Error, Field, FormProgress, Input, Select } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import type { ReviewerForm as ReviewerFormType } from "./schema";
import { ReviewerSchema } from "./schema";

export function ReviewerForm({
  validTokens,
  defaultValues,
  address,
  onNext,
  onPrevious,
}: {
  validTokens: Token[];
  defaultValues?: DefaultValues<ReviewerFormType>;
  onNext: (data: ReviewerFormType) => void;
  onPrevious: (data: ReviewerFormType) => void;
  address: `0x${string}`;
}) {
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewerFormType>({
    resolver: zodResolver(ReviewerSchema),
    defaultValues,
  });

  const selectedReviewDate = watch("reviewEndDate");
  const selectedReviewTime = watch("reviewEndTime");

  const rewardPool = watch("rewardPool");
  const reviewLimit = watch("reviewLimit");
  const rewardTokenAddress = watch("rewardToken");
  const rewardToken = validTokens.find((t) => t.contractAddress === rewardTokenAddress);

  const formData = watch();
  const onGoBack = () => {
    onPrevious(formData);
  };

  const currentDate = new Date();
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto px-5 my-16 space-y-10">
        <div className="space-y-4">
          <h1 className="font-semibold text-3xl">Reviewers</h1>
          <p className="text-lg text-cyan-500">
            Reviewers are rewarded based on their shared of overall submissions scored once the review deadline is
            reached.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-bold">Review Deadline*</h2>
          <div className="flex gap-4 md:flex-row flex-col">
            <div className="flex-grow w-full">
              <Field>
                <Input {...register("reviewEndDate")} type="date" />
                <Error error={errors.reviewEndDate?.message} />
              </Field>
            </div>
            <div className="flex-grow w-full">
              <Field>
                <Input {...register("reviewEndTime")} type="time" />
                <Error error={errors.reviewEndTime?.message} />
              </Field>
            </div>
          </div>
          <p className="text-gray-400 italic">
            {selectedReviewDate &&
              selectedReviewTime &&
              `Reviewers must claim this challenge by ${claimToReviewDeadline.toLocaleDateString()} at ${claimToReviewDeadline.toLocaleTimeString()} to score submissions`}
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-bold">Reviewer Rewards</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-grow w-full">
              <Field>
                <h3 className="text-sm">Reward Token*</h3>
                <Controller
                  name="rewardToken"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder="Token"
                        onChange={(v) => {
                          const token = validTokens.find((t) => t.contractAddress === v);
                          invariant(token, "Token not found");
                          setValue("rewardTokenDecimals", token.decimals);
                          field.onChange(v);
                        }}
                        options={validTokens.map((t) => {
                          return { label: t.symbol, value: t.contractAddress };
                        })}
                      />
                    );
                  }}
                />
                <Error error={errors.rewardToken?.message} />
              </Field>
            </div>
            <div className="flex-grow w-full">
              <Field>
                <h3 className="text-sm">Reward Pool*</h3>
                <Input {...register("rewardPool")} name="rewardPool" placeholder="Pool amount" />
                <Error error={errors.rewardPool?.message} />
              </Field>
            </div>
          </div>
          <h3 className="text-sm">Total Review Limit*</h3>
          <div className="flex gap-4 items-center">
            <Field>
              <Input {...register("reviewLimit")} type="text" />
              <Error error={errors.reviewLimit?.message} />
            </Field>
            <p>Reviewers will be able to review this Challenge.</p>
          </div>
          {rewardPool && rewardToken && reviewLimit && reviewLimit != 0 && (
            <p className="text-neutral-600 text-sm">{`Ensures a minimum reward of ${BigNumber.from(rewardPool)
              .div(reviewLimit)
              .toString()} ${rewardToken.symbol} per review`}</p>
          )}
        </section>
      </div>
      <FormProgress
        percent={75}
        onGoBack={onGoBack}
        onNext={handleSubmit(onNext)}
        cancelLink={`/app/market/${address}`}
      />
    </div>
  );
}
