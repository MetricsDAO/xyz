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

  const selectedSubmitDate = watch("Step2.endDate");
  const selectedSubmitTime = watch("Step2.endTime");

  const selectedReviewDate = watch("Step3.reviewEndDate");
  const selectedReviewTime = watch("Step3.reviewEndTime");

  const formData = watch();

  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(selectedSubmitDate, selectedSubmitTime)));
  const claimToReviewDeadline = new Date(claimDate(currentDate, parseDatetime(selectedReviewDate, selectedReviewTime)));

  return (
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
    </>
  );
}
