import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, Input, Error, Combobox, Select, FormProgress, FormStepper } from "~/components";
import type { Project, Token } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import type { ServiceRequestForm, AppDataForm, AnalystForm, ReviewerForm } from "./schema";
import { ServiceRequestFormSchema } from "./schema";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { claimDate, parseDatetime } from "~/utils/date";
import invariant from "tiny-invariant";
import { BigNumber } from "ethers";

export function FinalStep({
  page1Data,
  page2Data,
  page3Data,
  tokens,
  projects,
  address,
  onSubmit,
}: {
  page1Data: AppDataForm | null;
  page2Data: AnalystForm | null;
  page3Data: ReviewerForm | null;
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
    defaultValues: {
      appData: {
        ...page1Data,
      },
      analystData: {
        ...page2Data,
      },
      reviewerData: {
        ...page3Data,
      },
    },
    resolver: zodResolver(ServiceRequestFormSchema),
  });

  const navigate = useNavigate();

  const onGoBack = () => {
    navigate(`/app/market/${address}/request/new/reviewer`);
  };

  const selectedSubmitDate = watch("analystData.endDate");
  const selectedSubmitTime = watch("analystData.endTime");

  const selectedReviewDate = watch("reviewerData.reviewEndDate");
  const selectedReviewTime = watch("reviewerData.reviewEndTime");

  const rewardPool = watch("reviewerData.rewardPool");
  const reviewLimit = watch("reviewerData.reviewLimit");
  const rewardTokenAddress = watch("reviewerData.rewardToken");
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
                  <Input {...register("analystData.endDate")} type="date" />
                  <Error error={errors.analystData?.endDate?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("analystData.endTime")} type="time" />
                  <Error error={errors.analystData?.endTime?.message} />
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
                    name="analystData.rewardToken"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          placeholder="Token"
                          onChange={(v) => {
                            const token = tokens.find((t) => t.contractAddress === v);
                            invariant(token, "Token not found");
                            setValue("analystData.rewardTokenDecimals", token.decimals);
                            field.onChange(v);
                          }}
                          options={tokens.map((t) => {
                            return { label: t.symbol, value: t.contractAddress };
                          })}
                        />
                      );
                    }}
                  />
                  <Error error={errors.analystData?.rewardToken?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <h3 className="text-sm">Reward Pool*</h3>
                  <Input {...register("analystData.rewardPool")} type="text" placeholder="Pool amount" />
                  <Error error={errors.analystData?.rewardPool?.message} />
                </Field>
              </div>
            </div>
            <p className="text-gray-400 italic">
              Rewards are distributed based on overall submission scores. Higher scores are rewarded more.
            </p>
            <h3 className="text-sm">Claim to Submit Limit*</h3>
            <div className="flex gap-4 items-center">
              <Field>
                <Input {...register("analystData.submitLimit")} type="text" />
                <Error error={errors.analystData?.submitLimit?.message} />
              </Field>
              <p className="text-neutral-600 text-sm">Analysts will be able to submit for this Challenge.</p>
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold">Review Deadline*</h2>
            <div className="flex gap-4 md:flex-row flex-col">
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("reviewerData.reviewEndDate")} type="date" />
                  <Error error={errors.reviewerData?.reviewEndDate?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("reviewerData.reviewEndTime")} type="time" />
                  <Error error={errors.reviewerData?.reviewEndTime?.message} />
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
                    name="reviewerData.rewardToken"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          {...field}
                          placeholder="Token"
                          onChange={(v) => {
                            const token = tokens.find((t) => t.contractAddress === v);
                            invariant(token, "Token not found");
                            setValue("reviewerData.rewardTokenDecimals", token.decimals);
                            field.onChange(v);
                          }}
                          options={tokens.map((t) => {
                            return { label: t.symbol, value: t.contractAddress };
                          })}
                        />
                      );
                    }}
                  />
                  <Error error={errors.reviewerData?.rewardToken?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <h3 className="text-sm">Reward Pool*</h3>
                  <Input {...register("reviewerData.rewardPool")} placeholder="Pool amount" />
                  <Error error={errors.reviewerData?.rewardPool?.message} />
                </Field>
              </div>
            </div>
            <h3 className="text-sm">Total Review Limit*</h3>
            <div className="flex gap-4 items-center">
              <Field>
                <Input {...register("reviewerData.reviewLimit")} type="text" />
                <Error error={errors.reviewerData?.reviewLimit?.message} />
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
