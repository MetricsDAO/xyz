import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { ClientOnly } from "remix-utils";
import invariant from "tiny-invariant";
import { Combobox, Error, Field, FormProgress, FormStepper, Input, Select } from "~/components";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { claimDate, parseDatetime } from "~/utils/date";
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

  const rewardPool = watch("reviewer.rewardPool");
  const reviewLimit = watch("reviewer.reviewLimit");
  const rewardTokenAddress = watch("reviewer.rewardToken");
  const rewardToken = tokens.find((t) => t.contractAddress === rewardTokenAddress);

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full">
        <form className="max-w-2xl mx-auto my-16 space-y-10">
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-grow w-full">
                <Field>
                  <h3 className="text-sm">Reward Token*</h3>
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
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <h3 className="text-sm">Reward Pool*</h3>
                  <Input {...register("analyst.rewardPool")} type="text" placeholder="Pool amount" />
                  <Error error={errors.analyst?.rewardPool?.message} />
                </Field>
              </div>
            </div>
            <p className="text-gray-400 italic">
              Rewards are distributed based on overall submission scores. Higher scores are rewarded more.
            </p>
            <h3 className="text-sm">Claim to Submit Limit*</h3>
            <div className="flex gap-4 items-center">
              <Field>
                <Input {...register("analyst.submitLimit")} type="text" />
                <Error error={errors.analyst?.submitLimit?.message} />
              </Field>
              <p className="text-neutral-600 text-sm">Analysts will be able to submit for this Challenge.</p>
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-grow w-full">
                <Field>
                  <h3 className="text-sm">Reward Token*</h3>
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
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <h3 className="text-sm">Reward Pool*</h3>
                  <Input {...register("reviewer.rewardPool")} placeholder="Pool amount" />
                  <Error error={errors.reviewer?.rewardPool?.message} />
                </Field>
              </div>
            </div>
            <h3 className="text-sm">Total Review Limit*</h3>
            <div className="flex gap-4 items-center">
              <Field>
                <Input {...register("reviewer.reviewLimit")} type="text" />
                <Error error={errors.reviewer?.reviewLimit?.message} />
              </Field>
              <p>Reviewers will be able to review this Challenge.</p>
            </div>
            {rewardPool && rewardToken && reviewLimit && (
              <p className="text-neutral-600 text-sm">{`Ensures a minimum reward of ${BigNumber.from(rewardPool)
                .div(reviewLimit)
                .toString()} ${rewardToken.symbol} per review`}</p>
            )}
          </section>
        </form>
        <FormProgress
          percent={100}
          onGoBack={onGoBack}
          cancelLink={`/app/market/${address}`}
          submitLabel="Launch Challenge"
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper step={4} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
