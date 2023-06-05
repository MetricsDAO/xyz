import { zodResolver } from "@hookform/resolvers/zod";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Combobox, Error, Field, FormProgress, Input, Label, Select, Textarea } from "~/components";
import { CurveChart } from "~/components/curve-chart";
import type { AppData } from "./schema";
import { AppDataSchema } from "./schema";
import { useProjects, useTokens } from "~/hooks/use-root-data";
import { ClientOnly } from "remix-utils";
import { MarkdownEditor } from "~/components/markdown-editor/markdown.client";

export function MarketplaceAppDataForm({
  defaultValues,
  onNext,
}: {
  defaultValues?: DefaultValues<AppData>;
  onNext: (values: AppData) => void;
}) {
  const tokens = useTokens();
  const projects = useProjects();
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppData>({
    resolver: zodResolver(AppDataSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const tokenAllowlist = tokens.map((t) => ({ label: t.name, value: t.symbol }));
  const enforcement = watch("enforcement");

  return (
    <div className="w-full justify-between flex flex-col">
      <div className="max-w-2xl mx-auto my-16 space-y-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold antialiased">Create an Analytics Marketplace</h1>
          <p className="text-cyan-500 text-lg">
            Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
            projects launch, grow and succeed.
          </p>
          <p className="text-sm text-gray-500">
            Define user permissions, blockchain/project and reward token allowlists, and the reward curve. These
            parameters will be applied to all challenges in this marketplace.
          </p>
        </section>

        <main className="flex-1">
          <form className="space-y-10 py-5">
            <input
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              type="hidden"
              {...register("type", { value: "analyze" })}
            />

            <Field>
              <Label size="lg">Challenge Marketplace Title*</Label>
              <Input {...register("title")} type="text" placeholder="e.g Solana Breakpoint 2023" />
              <Error error={errors.title?.message} />
            </Field>

            <Field>
              <Label size="lg">Details*</Label>
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
              <Error error={errors.description?.message} />
            </Field>

            <Field>
              <Label size="lg">Blockchain/Project(s)*</Label>
              <Controller
                control={control}
                name="projectSlugs"
                render={({ field }) => (
                  <Combobox {...field} options={projects.map((p) => ({ label: p.name, value: p.slug }))} />
                )}
              />
              <Error error={errors.projectSlugs?.message} />
            </Field>

            <section>
              <h4 className="font-semibold mb-4">Challenge Rewards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <Label>Reward Token Allowlist</Label>
                  <Controller
                    control={control}
                    name="tokenAllowlist"
                    render={({ field }) => <Combobox {...field} options={tokenAllowlist} />}
                  />
                  <Error error={errors.tokenAllowlist?.message} />
                </Field>
                <Field>
                  <Label>Reward Curve</Label>
                  <Controller
                    control={control}
                    name="enforcement"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[{ label: "Constant Likert", value: "0x0b9CDd330C8FF08D7E3D298dcBc84B3077C33C7C" }]}
                      />
                    )}
                  />
                  <Error error={errors.enforcement?.message} />
                </Field>
              </div>
            </section>

            {enforcement && (
              <>
                <CurveChart type={"Constant"} />
                <p className="text-gray-400 italic">Ex: 1000 USDC pool with a claim limit of 10</p>
              </>
            )}
          </form>
        </main>
      </div>
      <FormProgress percent={20} onNext={handleSubmit(onNext)} cancelLink={"/appp/analyze"} />
    </div>
  );
}
