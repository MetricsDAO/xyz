import { zodResolver } from "@hookform/resolvers/zod";
import type { Token } from "@prisma/client";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import { CurveChart, Error, Field, FormProgress, Input, Select } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import { fromTokenAmount, toTokenAbbreviation, toTokenAmount } from "~/utils/helpers";
import type { AnalystForm as AnalystFormType } from "./schema";
import { AnalystSchema } from "./schema";

export function AnalystForm({
  validTokens,
  defaultValues,
  onNext,
  onPrevious,
  address,
}: {
  validTokens: Token[];
  defaultValues?: DefaultValues<AnalystFormType>;
  onNext: (data: AnalystFormType) => void;
  onPrevious: (data: AnalystFormType) => void;
  address: `0x${string}`;
}) {
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AnalystFormType>({
    resolver: zodResolver(AnalystSchema),
    defaultValues,
  });

  const onGoBack = () => {
    onPrevious(formData);
  };

  const selectedSubmitDate = watch("endDate");
  const selectedSubmitTime = watch("endTime");

  const formData = watch();

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto px-5 my-16 space-y-10">
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
          <p>Reward Pool</p>
          <div className="flex flex-wrap gap-2 items-start">
            <Field>
              <Input {...register("submitLimit")} type="text" />
              <Error error={errors.submitLimit?.message} />
            </Field>
            <p className="text-neutral-600 text-sm mt-3">Analysts can earn up to</p>
            <Field>
              <Input {...register("rewardPool")} name="rewardPool" placeholder="Pool amount" />
              <Error error={errors.rewardPool?.message} />
            </Field>
            <Field>
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
            <p className="text-neutral-600 text-sm mt-3">for a total reward pool of</p>
            {formData.rewardPool && formData.submitLimit && formData.rewardToken ? (
              <p className="text-neutral-600 text-sm font-bold mt-3">
                {`${fromTokenAmount(
                  toTokenAmount(formData.rewardPool, formData.rewardTokenDecimals).mul(formData.submitLimit).toString(),
                  formData.rewardTokenDecimals
                )}
                ${toTokenAbbreviation(formData.rewardToken, validTokens)}`}
              </p>
            ) : (
              <p className="text-neutral-600 text-sm font-bold mt-3">--</p>
            )}
          </div>
          {formData.rewardToken && formData.rewardPool && (
            <>
              <CurveChart
                type={"Constant"}
                token={toTokenAbbreviation(formData.rewardToken, validTokens)}
                amount={toTokenAmount(formData.rewardPool, formData.rewardTokenDecimals).toString()}
                decimals={formData.rewardTokenDecimals}
              />
              <p className="text-gray-400 italic">Unused funds can be reclaimed after the the Review Deadline.</p>
            </>
          )}
        </section>
      </div>
      <FormProgress
        percent={50}
        onGoBack={onGoBack}
        onNext={handleSubmit(onNext)}
        cancelLink={`/app/market/${address}`}
      />
    </div>
  );
}
