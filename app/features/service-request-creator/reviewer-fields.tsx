import type { Token } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { Button, Error, Field, Input, Progress, Select } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import type { ReviewerForm } from "./schema";
import { ReviewerSchema } from "./schema";
import invariant from "tiny-invariant";
import { BigNumber } from "ethers";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStepper from "~/components/form-stepper/form-stepper";

export function ReviewerFields({
  validTokens,
  currentData,
  onDataUpdate,
  address,
}: {
  validTokens: Token[];
  currentData: ReviewerForm | null;
  onDataUpdate: (data: ReviewerForm) => void;
  address: `0x${string}`;
}) {
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewerForm>({
    resolver: zodResolver(ReviewerSchema),
    defaultValues: {
      ...currentData,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (values: ReviewerForm) => {
    onDataUpdate(values);
    navigate(`/app/market/${address}/request/new/overview`);
  };

  const onGoBack = () => {
    onDataUpdate(formData);
    navigate(`/app/market/${address}/request/new/analyst`);
  };

  //const selectedSubmitDate = watch("endDate");
  //const selectedSubmitTime = watch("endTime");

  const selectedReviewDate = watch("reviewEndDate");
  const selectedReviewTime = watch("reviewEndTime");

  const rewardPool = watch("rewardPool");
  const reviewLimit = watch("reviewLimit");
  const rewardTokenAddress = watch("rewardToken");
  const rewardToken = validTokens.find((t) => t.contractAddress === rewardTokenAddress);

  const formData = watch();

  const currentDate = new Date();
  //const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full">
        <div className="max-w-2xl mx-auto my-16 space-y-10">
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
        <div className=" w-full">
          <Progress progress={75} />
          <div className="flex items-center justify-evenly">
            <div className="flex items-center">
              <div className="flex gap-3 items-center cursor-pointer" onClick={onGoBack}>
                <ArrowLeftCircleIcon className="h-8 w-8 text-black" />
                <p className="mr-6">Prev</p>
              </div>
              <button className="flex gap-3 items-center cursor-pointer" onClick={handleSubmit(onSubmit)}>
                <p>Next</p>
                <ArrowRightCircleIcon className="h-8 w-8 text-black" />
              </button>
            </div>
            <div className="flex items-center">
              <Button className="my-5 mr-4" variant="cancel">
                <Link to={`/app/market/${address}`}>Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper step={3} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
