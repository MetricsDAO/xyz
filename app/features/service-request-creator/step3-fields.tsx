import type { Project, Token } from "@prisma/client";
import { Controller, useFormContext } from "react-hook-form";
import { Error, Field, Input, Select } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import type { ServiceRequestForm } from "./schema";
import invariant from "tiny-invariant";
import { BigNumber } from "ethers";

export function Step3Fields({ validTokens, validProjects }: { validTokens: Token[]; validProjects: Project[] }) {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<ServiceRequestForm>();

  const selectedSubmitDate = watch("Step2.endDate");
  const selectedSubmitTime = watch("Step2.endTime");

  const selectedReviewDate = watch("Step3.reviewEndDate");
  const selectedReviewTime = watch("Step3.reviewEndTime");

  const rewardPool = watch("Step3.rewardPool");
  const reviewLimit = watch("Step3.reviewLimit");
  const rewardTokenAddress = watch("Step3.rewardToken");
  const rewardToken = validTokens.find((t) => t.contractAddress === rewardTokenAddress);

  const formData = watch();

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <>
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
              <Input {...register("Step3.reviewEndDate")} type="date" />
              <Error error={errors.Step3?.reviewEndDate?.message} />
            </Field>
          </div>
          <div className="flex-grow w-full">
            <Field>
              <Input {...register("Step3.reviewEndTime")} type="time" />
              <Error error={errors.Step3?.reviewEndTime?.message} />
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
                name="Step3.rewardToken"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="Token"
                      onChange={(v) => {
                        const token = validTokens.find((t) => t.contractAddress === v);
                        invariant(token, "Token not found");
                        setValue("Step3.rewardTokenDecimals", token.decimals);
                        field.onChange(v);
                      }}
                      options={validTokens.map((t) => {
                        return { label: t.symbol, value: t.contractAddress };
                      })}
                    />
                  );
                }}
              />
              <Error error={errors.Step3?.rewardToken?.message} />
            </Field>
          </div>
          <div className="flex-grow w-full">
            <Field>
              <h3 className="text-sm">Reward Pool*</h3>
              <Input {...register("Step3.rewardPool")} name="rewardPool" placeholder="Pool amount" />
              <Error error={errors.Step3?.rewardPool?.message} />
            </Field>
          </div>
        </div>
        <h3 className="text-sm">Total Review Limit*</h3>
        <div className="flex gap-4 items-center">
          <Field>
            <Input {...register("Step3.reviewLimit")} type="text" />
            <Error error={errors.Step3?.reviewLimit?.message} />
          </Field>
          {rewardPool && rewardToken && reviewLimit && (
            <p className="text-neutral-600 text-sm">{`ensures a minimum reward of ${BigNumber.from(rewardPool)
              .div(reviewLimit)
              .toString()} ${rewardToken.symbol} per review`}</p>
          )}
        </div>
      </section>
    </>
  );
}
