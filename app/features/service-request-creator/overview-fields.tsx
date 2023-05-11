import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Field, Input, Error, Combobox, Select, Button, Progress } from "~/components";
import type { Project, Token } from "@prisma/client";
import { useContracts } from "~/hooks/use-root-data";
import type { EvmAddress } from "~/domain/address";
import { Link, useNavigate } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import { ServiceRequestForm, ServiceRequestFormSchema, Step1Form, Step2Form, Step3Form } from "./schema";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { claimDate, parseDatetime } from "~/utils/date";
import invariant from "tiny-invariant";
import { BigNumber } from "ethers";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import FormStepper from "~/components/form-stepper/form-stepper";

export function FinalStep({
  page1Data,
  page2Data,
  page3Data,
  tokens,
  projects,
  address,
}: {
  page1Data: Step1Form | null;
  page2Data: Step2Form | null;
  page3Data: Step3Form | null;
  tokens: Token[];
  projects: Project[];
  address: `0x${string}`;
}) {
  const {
    control,
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<ServiceRequestForm>({
    defaultValues: {
      Step1: {
        ...page1Data,
      },
      Step2: {
        ...page2Data,
      },
      Step3: {
        ...page3Data,
      },
    },
    resolver: zodResolver(ServiceRequestFormSchema),
  });

  const contracts = useContracts();

  const navigate = useNavigate();

  const onSubmit = (data: ServiceRequestForm) => {
    console.log(data);
    // write to contract with values
  };

  const onGoBack = () => {
    navigate(`/app/market/${address}/request/new/step3`);
  };

  const selectedSubmitDate = watch("Step2.endDate");
  const selectedSubmitTime = watch("Step2.endTime");

  const selectedReviewDate = watch("Step3.reviewEndDate");
  const selectedReviewTime = watch("Step3.reviewEndTime");

  const rewardPool = watch("Step3.rewardPool");
  const reviewLimit = watch("Step3.reviewLimit");
  const rewardTokenAddress = watch("Step3.rewardToken");
  const rewardToken = tokens.find((t) => t.contractAddress === rewardTokenAddress);

  const formData = watch();

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full">
        <div className="max-w-2xl mx-auto my-16 space-y-10">
          <section className="space-y-3">
            <h2 className="font-bold">Challenge Title*</h2>
            <Field>
              <Input {...register("Step1.title")} type="text" placeholder="Challenge Title" className="w-full" />
              <Error error={errors.Step1?.title?.message} />
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
                        options={projects.map((p) => ({ label: p.name, value: p.slug }))}
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
                            const token = tokens.find((t) => t.contractAddress === v);
                            invariant(token, "Token not found");
                            setValue("Step2.rewardTokenDecimals", token.decimals);
                            field.onChange(v);
                          }}
                          options={tokens.map((t) => {
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
                            const token = tokens.find((t) => t.contractAddress === v);
                            invariant(token, "Token not found");
                            setValue("Step3.rewardTokenDecimals", token.decimals);
                            field.onChange(v);
                          }}
                          options={tokens.map((t) => {
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
        </div>
        <div className=" w-full">
          <Progress progress={100} />
          <div className="flex items-center justify-evenly">
            <div className="flex items-center">
              <div className="flex gap-3 items-center cursor-pointer" onClick={onGoBack}>
                <ArrowLeftCircleIcon className="h-8 w-8 text-black" />
                <p className="mr-6 text-neutral-400">Prev</p>
              </div>
              <div className="flex gap-3 items-center">
                <p className="text-neutral-400">Next</p>
                <ArrowRightCircleIcon className="h-8 w-8 text-neutral-400" />
              </div>
            </div>
            <div className="flex items-center">
              <Button className="my-5 mr-4" variant="cancel">
                <Link to={`/app/market/${address}`}>Cancel</Link>
              </Button>
              <Button>Launch Challenge</Button>
            </div>
          </div>
        </div>
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper step={4} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
