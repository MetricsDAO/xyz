import type { Project } from "@prisma/client";
import { ClientOnly } from "remix-utils";
import { Combobox, Error, Field, Input, Select, FormProgress, FormStepper } from "~/components";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import type { AppDataForm } from "./schema";
import { AppDataSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";

export function AppDataFields({
  currentData,
  projects,
  onDataUpdate,
  address,
}: {
  currentData: AppDataForm | null;
  projects: Project[];
  onDataUpdate: (data: AppDataForm) => void;
  address: `0x${string}`;
}) {
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AppDataForm>({
    resolver: zodResolver(AppDataSchema),
    defaultValues: {
      ...currentData,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (values: AppDataForm) => {
    onDataUpdate(values);
    navigate(`/app/market/${address}/request/new/analyst`);
  };

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full">
        <div className="max-w-2xl mx-auto my-16 space-y-10">
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
          <section className="space-y-3">
            <h2 className="font-bold">Challenge Title*</h2>
            <Field>
              <Input {...register("title")} type="text" placeholder="Challenge Title" className="w-full" />
              <Error error={errors.title?.message} />
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
                    value={watch("description")}
                    onChange={(v) => {
                      setValue("description", v ?? "");
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
                    name="language"
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
                  <Error error={errors.language?.message} />
                </Field>
              </div>
              <div className="flex-grow">
                <Field>
                  <Controller
                    control={control}
                    name="projectSlugs"
                    render={({ field }) => (
                      <Combobox
                        {...field}
                        placeholder="Blockchain/Project"
                        options={projects.map((p) => ({ label: p.name, value: p.slug }))}
                      />
                    )}
                  />
                  <Error error={errors.projectSlugs?.message} />
                </Field>
              </div>
            </div>
          </section>
        </div>
        <FormProgress percent={25} onNext={handleSubmit(onSubmit)} cancelLink={`/app/market/${address}`} />
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper step={1} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
