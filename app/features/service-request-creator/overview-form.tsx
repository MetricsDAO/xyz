import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { Combobox, Error, Field, FormProgress, FormStepper, Input, Select } from "~/components";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { claimDate, parseDatetime } from "~/utils/date";
import { fromTokenAmount, toTokenAmount } from "~/utils/helpers";
import type { ServiceRequestForm } from "./schema";
import { ServiceRequestFormSchema } from "./schema";

export function OverviewForm({
  defaultValues,
  tokens,
  projects,
  address,
  onSubmit,
}: {
  defaultValues?: DefaultValues<ServiceRequestForm>;
  tokens: Token[];
  projects: Project[];
  address: `0x${string}`;
  onSubmit: (data: ServiceRequestForm) => void;
}) {
  const {
    control,
    watch,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<ServiceRequestForm>({
    defaultValues,
    resolver: zodResolver(ServiceRequestFormSchema),
  });

  const navigate = useNavigate();

  const onGoBack = () => {
    navigate(`/app/market/${address}/request/new/reviewer`);
  };

  const selectedSubmitDate = watch("analyst.endDate");
  const selectedSubmitTime = watch("analyst.endTime");

  const selectedReviewDate = watch("reviewer.reviewEndDate");
  const selectedReviewTime = watch("reviewer.reviewEndTime");

  const analystMaxReward = watch("analyst.maxReward");
  const analystSubmitLimit = watch("analyst.submitLimit");
  const analystRewardTokenAddress = watch("analyst.rewardToken");
  const analystRewardToken = tokens.find((t) => t.contractAddress === analystRewardTokenAddress);

  const reviewerMaxReward = watch("reviewer.maxReward");
  const reviewerReviewLimit = watch("reviewer.reviewLimit");
  const reviewerRewardTokenAddress = watch("reviewer.rewardToken");
  const reviewerRewardToken = tokens.find((t) => t.contractAddress === reviewerRewardTokenAddress);

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full">
        <form className="max-w-2xl mx-auto px-5 my-16 space-y-10">
          <section className="space-y-3">
            <h2 className="font-bold">Challenge Title*</h2>
            <Field>
              <Input {...register("appData.title")} type="text" placeholder="Challenge Title" className="w-full" />
              <Error error={errors.appData?.title?.message} />
            </Field>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold">
              What question, problem, or tooling need do you want Web3 analysts to address?*
            </h2>
            <Field>
              <ClientOnly>
                {() => (
                  <div className="container overflow-auto">
                    <MarkdownEditor
                      value={watch("appData.description")}
                      onChange={(v) => {
                        setValue("appData.description", v ?? "");
                      }}
                    />
                  </div>
                )}
              </ClientOnly>
              <Error error={errors.appData?.description?.message} />
            </Field>
          </section>
          <section className="space-y-3">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-grow">
                <Field>
                  <Controller
                    name="appData.language"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          placeholder="English"
                          value={"english"}
                          options={[{ label: "English", value: "english" }]}
                        />
                      );
                    }}
                  />
                  <Error error={errors.appData?.language?.message} />
                </Field>
              </div>
              <div className="flex-grow">
                <Field>
                  <Controller
                    control={control}
                    name="appData.projectSlugs"
                    render={({ field }) => (
                      <Combobox
                        {...field}
                        placeholder="Blockchain/Project"
                        options={projects.map((p) => ({ label: p.name, value: p.slug }))}
                      />
                    )}
                  />
                  <Error error={errors.appData?.projectSlugs?.message} />
                </Field>
              </div>
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold">Submission Deadline*</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("analyst.endDate")} type="date" />
                  <Error error={errors.analyst?.endDate?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("analyst.endTime")} type="time" />
                  <Error error={errors.analyst?.endTime?.message} />
                </Field>
              </div>
            </div>
            <p className="text-gray-400 italic">
              {selectedSubmitDate &&
                selectedSubmitTime &&
                `Analysts must claim this topic by ${signalDeadline.toLocaleDateString()} at ${signalDeadline.toLocaleTimeString()} to submit`}
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold">Analyst Rewards</h2>
            <p>Reward Pool</p>
            <div className="flex flex-wrap gap-2 items-start">
              <Field>
                <Input {...register("analyst.submitLimit")} type="text" />
                <Error error={errors.analyst?.submitLimit?.message} />
              </Field>
              <p className="text-neutral-600 text-sm mt-3">Analysts can earn up to</p>
              <Field>
                <Input {...register("analyst.maxReward")} placeholder="max earn" />
                <Error error={errors.analyst?.maxReward?.message} />
              </Field>
              <Field>
                <Controller
                  name="analyst.rewardToken"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder="Token"
                        onChange={(v) => {
                          const token = tokens.find((t) => t.contractAddress === v);
                          invariant(token, "Token not found");
                          setValue("analyst.rewardTokenDecimals", token.decimals);
                          field.onChange(v);
                        }}
                        options={tokens.map((t) => {
                          return { label: t.symbol, value: t.contractAddress };
                        })}
                      />
                    );
                  }}
                />
                <Error error={errors.analyst?.rewardToken?.message} />
              </Field>
              <p className="text-neutral-600 text-sm mt-3">for a total reward pool of</p>
              {analystMaxReward && analystSubmitLimit && analystRewardToken ? (
                <p className="text-neutral-600 text-sm font-bold mt-3">
                  {`${fromTokenAmount(
                    toTokenAmount(analystMaxReward, analystRewardToken.decimals).mul(analystSubmitLimit).toString(),
                    analystRewardToken.decimals
                  )}
                ${analystRewardToken.symbol}`}
                </p>
              ) : (
                <p className="text-neutral-600 text-sm font-bold mt-3">--</p>
              )}
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold">Review Deadline*</h2>
            <div className="flex gap-4 md:flex-row flex-col">
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("reviewer.reviewEndDate")} type="date" />
                  <Error error={errors.reviewer?.reviewEndDate?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("reviewer.reviewEndTime")} type="time" />
                  <Error error={errors.reviewer?.reviewEndTime?.message} />
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
            <div className="flex flex-wrap gap-2 items-start">
              <Field>
                <Input {...register("reviewer.reviewLimit")} type="text" />
                <Error error={errors.reviewer?.reviewLimit?.message} />
              </Field>
              <p className="text-neutral-600 text-sm mt-3">Reviews will be paid</p>
              <Field>
                <Input {...register("reviewer.maxReward")} placeholder="max earn" />
                <Error error={errors.reviewer?.maxReward?.message} />
              </Field>
              <Field>
                <Controller
                  name="reviewer.rewardToken"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder="Token"
                        onChange={(v) => {
                          const token = tokens.find((t) => t.contractAddress === v);
                          invariant(token, "Token not found");
                          setValue("reviewer.rewardTokenDecimals", token.decimals);
                          field.onChange(v);
                        }}
                        options={tokens.map((t) => {
                          return { label: t.symbol, value: t.contractAddress };
                        })}
                      />
                    );
                  }}
                />
                <Error error={errors.reviewer?.rewardToken?.message} />
              </Field>
              <p className="text-neutral-600 text-sm mt-3">for a total reward pool of</p>
              {reviewerMaxReward && reviewerReviewLimit && reviewerRewardToken ? (
                <p className="text-neutral-600 text-sm font-bold mt-3">
                  {`${fromTokenAmount(
                    toTokenAmount(reviewerMaxReward, reviewerRewardToken.decimals).mul(reviewerReviewLimit).toString(),
                    reviewerRewardToken.decimals
                  )}
                ${reviewerRewardToken?.symbol}`}
                </p>
              ) : (
                <p className="text-neutral-600 text-sm font-bold mt-3">--</p>
              )}
            </div>
          </section>
          <p className="text-gray-400 italic">Unused funds can be reclaimed after the the Review Deadline.</p>
        </form>
        <FormProgress
          percent={100}
          onGoBack={onGoBack}
          cancelLink={`/app/market/${address}`}
          submitLabel="Launch Challenge"
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
      <aside className="w-1/4 py-28 ml-2 md:block hidden">
        <FormStepper step={4} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
