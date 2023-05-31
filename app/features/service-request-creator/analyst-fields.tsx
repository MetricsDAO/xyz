import type { Token } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { Error, Field, Input, Select, FormProgress, FormStepper } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import type { AnalystForm } from "./schema";
import { AnalystSchema } from "./schema";
import invariant from "tiny-invariant";
import { useNavigate } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";

export function AnalystFields({
  validTokens,
  currentData,
  onDataUpdate,
  address,
}: {
  validTokens: Token[];
  currentData: AnalystForm | null;
  onDataUpdate: (data: AnalystForm) => void;
  address: `0x${string}`;
}) {
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AnalystForm>({
    resolver: zodResolver(AnalystSchema),
    defaultValues: {
      ...currentData,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (values: AnalystForm) => {
    onDataUpdate(values);
    navigate(`/app/market/${address}/request/new/reviewer`);
  };

  const onGoBack = () => {
    console.log(formData);
    onDataUpdate(formData);
    navigate(`/app/market/${address}/request/new`);
  };

  const selectedSubmitDate = watch("endDate");
  const selectedSubmitTime = watch("endTime");

  const formData = watch();

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full">
        <div className="max-w-2xl mx-auto my-16 space-y-10">
          <div className="space-y-4">
            <h1 className="font-semibold text-3xl">Analysts</h1>
            <p className="text-lg text-cyan-500">
              Analysts are rewarded based on the Marketplace reward curve once the review deadline is reached.
            </p>
          </div>

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
            <h3 className="text-sm">Total Submissions Limit*</h3>
            <div className="flex gap-4 items-center">
              <Field>
                <Input {...register("submitLimit")} type="text" />
                <Error error={errors.submitLimit?.message} />
              </Field>
              <p className="text-neutral-600 text-sm">Analysts will be able to submit for this Challenge.</p>
            </div>
          </section>
        </div>
        <FormProgress
          percent={50}
          onGoBack={onGoBack}
          onNext={handleSubmit(onSubmit)}
          cancelLink={`/app/market/${address}`}
        />
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper step={2} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
