import { InformationCircleIcon } from "@heroicons/react/20/solid";
import type { Project, Token } from "@prisma/client";
import { Controller, useFormContext } from "react-hook-form";
import { ClientOnly } from "remix-utils";
import { Combobox, Error, Field, Input, Select } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import type { ServiceRequestForm } from "./schema";
import invariant from "tiny-invariant";

export function ServiceRequestCreatorFields({
  validTokens,
  validProjects,
  page,
  header,
}: {
  validTokens: Token[];
  validProjects: Project[];
  page: number;
  header: boolean;
}) {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<ServiceRequestForm>();

  const selectedSubmitDate = watch("endDate");
  const selectedSubmitTime = watch("endTime");

  const selectedReviewDate = watch("reviewEndDate");
  const selectedReviewTime = watch("reviewEndTime");

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <>
      {(page === 1 || page === 4) && (
        <>
          {header && (
            <div className="space-y-2">
              <h1 className="font-semibold text-3xl mb-2">Launch an Analytics Challenge</h1>
              <p className="text-lg text-cyan-500">
                Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
                projects launch, grow and succeed.
              </p>
              <p className="text-sm text-gray-500">
                Define user permissions, blockchain/project and reward token allowlists, and the reward curve. These
                parameters will be applied to all challenges in this marketplace
              </p>
            </div>
          )}
          <section className="space-y-3">
            <h2 className="font-bold">Challenge Title*</h2>
            <Field>
              <Input {...register("appData.title")} type="text" placeholder="Challenge Title" className="w-full" />
              <Error error={errors.appData?.title?.message} />
            </Field>
          </section>
          <section className="space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <h2 className="font-bold">
                What question, problem, or tooling need do you want Web3 analysts to address?*
              </h2>
              <InformationTooltip />
            </div>
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
                        options={validProjects.map((p) => ({ label: p.name, value: p.slug }))}
                      />
                    )}
                  />
                  <Error error={errors.appData?.projectSlugs?.message} />
                </Field>
              </div>
            </div>
          </section>
        </>
      )}

      {(page === 2 || page === 4) && (
        <>
          {header && (
            <div className="space-y-4">
              <h1 className="font-semibold text-3xl">Analysts</h1>
              <p className="text-lg text-cyan-500">
                Analysts are rewarded based on the Marketplace reward curve once the review deadline is reached.
              </p>
            </div>
          )}
          <section className="space-y-3">
            <h2 className="font-bold">Submission Deadline*</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("endDate")} type="date" />
                  <Error error={errors.endDate?.message} />
                </Field>
              </div>
              <div className="flex-grow w-full">
                <Field>
                  <Input {...register("endTime")} type="time" />
                  <Error error={errors.endTime?.message} />
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
            <p className="text-gray-400 italic">
              Rewards are distributed based on overall submission scores. Higher scores are rewarded more.
            </p>
            <h3 className="text-sm">Claim to Submit Limit*</h3>
            <div className="flex gap-4 items-center">
              <Field>
                <Controller
                  control={control}
                  name="todo"
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Limit"
                      options={[
                        { label: "Limited", value: "limited" },
                        { label: "Unlimited", value: "unlimited" },
                      ]}
                    />
                  )}
                />
                <Error error={errors.appData?.projectSlugs?.message} />
              </Field>
              <Field>
                <Input {...register("endTime")} type="text" />
                <Error error={errors.endTime?.message} />
              </Field>
              <p className="text-neutral-600 text-sm">Analysts can claim to submit for this challenge.</p>
            </div>
          </section>
        </>
      )}

      {(page === 3 || page == 4) && (
        <>
          {header && (
            <div className="space-y-4">
              <h1 className="font-semibold text-3xl">Reviewers</h1>
              <p className="text-lg text-cyan-500">
                Reviewers are rewarded based on their shared of overall submissions scored once the review deadline is
                reached.
              </p>
            </div>
          )}
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
                <Controller
                  control={control}
                  name="todo"
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Limit"
                      options={[
                        { label: "Limited", value: "limited" },
                        { label: "Unlimited", value: "unlimited" },
                      ]}
                    />
                  )}
                />
                <Error error={errors.appData?.projectSlugs?.message} />
              </Field>
              <Field>
                <Input {...register("endTime")} type="text" />
                <Error error={errors.endTime?.message} />
              </Field>
              <p className="text-neutral-600 text-sm">{"ensures a minimum reward of {amount} {token} per review"}</p>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function InformationTooltip() {
  return (
    <div className="group">
      <InformationCircleIcon className="h-5 w-5 text-neutral-400 ml-1" />
      <div className="absolute z-30 hidden group-hover:block rounded-lg border-2 p-5 bg-blue-100 space-y-6 text-sm max-w-lg">
        <p className="font-bold">Be specific:</p>
        <div className="text-gray-500 space-y-3">
          <p>"How many people actively use Sushi?"</p>
          <p>
            The original question has many interpretations: SUSHI the token? SUSHI the dex? What is a person? Are we
            talking Ethereum? What about Polygon?
          </p>
          <p className="font-medium italic">UPDATE: How many addresses actively use the SUSHI token on Ethereum? </p>
        </div>
        <p className="font-bold">Define metrics:</p>
        <div className="text-gray-500 space-y-3">
          <p>
            What is “active“? What is “use”? These terms can (and will) mean different things to different people. It
            doesn't matter what definition you use as long as you communicate your expectations. Alternatively, you can
            ask for the metric to be defined as part of the question.
          </p>
          <p className="font-medium italic">UPDATE: How many addresses have transferred SUSHI on Ethereum?</p>
        </div>
        <div className="space-y-3">
          <p className="font-bold">Specify time boundaries:</p>
          <div className="text-gray-500 space-y-3">
            <p>
              We still haven't fully defined “active”. Specifying time makes the result easier to understand, don't rely
              on the person answering the question to specify time for you if you didn’t ask them to.
            </p>
            <p className="font-medium italic">
              UPDATE: How many addresses have transferred SUSHI on Ethereum in the last 90 days?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
