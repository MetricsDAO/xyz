import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { finalMarketData, step1Data, step2Data } from "~/domain/labor-market/schemas";
import { finalMarketSchema } from "~/domain/labor-market/schemas";
import { Container, Field, Input, Label, Error, Textarea, Combobox, Select, Button } from "~/components";
import type { Project, Token } from "@prisma/client";
import { useContracts } from "~/hooks/use-root-data";
import type { EvmAddress } from "~/domain/address";
import { useNavigate } from "@remix-run/react";

export function FinalStep({
  page1Data,
  page2Data,
  page3Data,
  page4Data,
  tokens,
  projects,
}: {
  page1Data: step1Data | null;
  page2Data: step2Data | null;
  page3Data: step2Data | null;
  page4Data: step2Data | null;
  tokens: Token[];
  projects: Project[];
}) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<finalMarketData>({
    defaultValues: {
      page1Data: {
        ...page1Data,
      },
      page2Data: {
        ...page2Data,
      },
      page3Data: {
        ...page3Data,
      },
      page4Data: {
        ...page4Data,
      },
    },
    resolver: zodResolver(finalMarketSchema),
  });

  return (
    <>
      <section className="space-y-3">
        <h2 className="font-bold">Challenge Title*</h2>
        <Field>
          <Input {...register("Step1.title")} type="text" placeholder="Challenge Title" className="w-full" />
          <Error error={errors.Step1?.title?.message} />
        </Field>
      </section>
      <section className="space-y-3">
        <h2 className="font-bold">What question, problem, or tooling need do you want Web3 analysts to address?*</h2>
        <ClientOnly>
          {() => (
            <div className="container overflow-auto">
              <MarkdownEditor
                value={watch("Step1.description")}
                onChange={(v) => {
                  setValue("Step1.description", v ?? "");
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
                name="Step1.language"
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
              <Error error={errors.Step1?.language?.message} />
            </Field>
          </div>
          <div className="flex-grow">
            <Field>
              <Controller
                control={control}
                name="Step1.projectSlugs"
                render={({ field }) => (
                  <Combobox
                    {...field}
                    placeholder="Blockchain/Project"
                    options={validProjects.map((p) => ({ label: p.name, value: p.slug }))}
                  />
                )}
              />
              <Error error={errors.Step1?.projectSlugs?.message} />
            </Field>
          </div>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="font-bold">Submission Deadline*</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow w-full">
            <Field>
              <Input {...register("Step2.endDate")} type="date" />
              <Error error={errors.Step2?.endDate?.message} />
            </Field>
          </div>
          <div className="flex-grow w-full">
            <Field>
              <Input {...register("Step2.endTime")} type="time" />
              <Error error={errors.Step2?.endTime?.message} />
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
                name="Step2.rewardToken"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      placeholder="Token"
                      onChange={(v) => {
                        const token = validTokens.find((t) => t.contractAddress === v);
                        invariant(token, "Token not found");
                        setValue("Step2.rewardTokenDecimals", token.decimals);
                        field.onChange(v);
                      }}
                      options={validTokens.map((t) => {
                        return { label: t.symbol, value: t.contractAddress };
                      })}
                    />
                  );
                }}
              />
              <Error error={errors.Step2?.rewardToken?.message} />
            </Field>
          </div>
          <div className="flex-grow w-full">
            <Field>
              <h3 className="text-sm">Reward Pool*</h3>
              <Input {...register("Step2.rewardPool")} name="rewardPool" placeholder="Pool amount" />
              <Error error={errors.Step2?.rewardPool?.message} />
            </Field>
          </div>
        </div>
        <p className="text-gray-400 italic">
          Rewards are distributed based on overall submission scores. Higher scores are rewarded more.
        </p>
        <h3 className="text-sm">Claim to Submit Limit*</h3>
        <div className="flex gap-4 items-center">
          <Field>
            <Input {...register("Step2.submitLimit")} type="text" />
            <Error error={errors.Step2?.submitLimit?.message} />
          </Field>
          <p className="text-neutral-600 text-sm">Analysts can claim to submit for this challenge.</p>
        </div>
      </section>
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
          <p className="text-neutral-600 text-sm">{"ensures a minimum reward of {amount} {token} per review"}</p>
        </div>
      </section>
    </>
  );
}
