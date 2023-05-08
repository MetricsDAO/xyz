import type { Project, Token } from "@prisma/client";
import { Controller, useFormContext } from "react-hook-form";
import { ClientOnly } from "remix-utils";
import { Combobox, Error, Field, Input, Select } from "~/components";
import { claimDate, parseDatetime } from "~/utils/date";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import type { ServiceRequestForm } from "./schema";

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
    </>
  );
}
