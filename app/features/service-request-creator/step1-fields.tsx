import type { Project } from "@prisma/client";
import { ClientOnly } from "remix-utils";
import { Button, Combobox, Error, Field, Input, Progress, Select } from "~/components";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";
import { Step1Form, Step1Schema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";
import { useContracts } from "~/hooks/use-root-data";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import FormStepper from "~/components/form-stepper/form-stepper";

export function Step1Fields({
  currentData,
  projects,
  onDataUpdate,
  address,
}: {
  currentData: Step1Form | null;
  projects: Project[];
  onDataUpdate: (data: Step1Form) => void;
  address: `0x${string}`;
}) {
  const contracts = useContracts();

  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Form>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      ...currentData,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (values: Step1Form) => {
    onDataUpdate(values);
    navigate(`/app/market/${address}/request/new/step2`);
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
        <div className=" w-full">
          <Progress progress={25} />
          <div className="flex items-center justify-evenly">
            <div className="flex items-center">
              <div className="flex gap-3 items-center">
                <ArrowLeftCircleIcon className="h-8 w-8 text-neutral-400" />
                <p className="mr-6 text-neutral-400">Prev</p>
              </div>
              <button className="flex gap-3 items-center cursor-pointer" onClick={handleSubmit(onSubmit)}>
                <p>Next</p>
                <ArrowRightCircleIcon className="h-8 w-8 text-black" />
              </button>
            </div>
            <div className="flex items-center">
              <Button className="my-5 mr-4" variant="cancel">
                <Link to={`/app/market/${address}`}>Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper step={1} labels={["Create", "Analysts", "Reviewers", "Overview"]} />
      </aside>
    </div>
  );
}
