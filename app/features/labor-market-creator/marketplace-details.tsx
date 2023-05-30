import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import * as Progress from "@radix-ui/react-progress";
import { useNavigate } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";
import { Combobox, Container, Error, Field, Input, Label, Select, Textarea } from "~/components";
import FormStepper from "~/components/form-stepper/form-stepper";
import type { MarketplaceData } from "~/domain/labor-market/schemas";
import { marketplaceDetailsSchema } from "~/domain/labor-market/schemas";

export function MarketplaceDetails({
  currentData,
  tokens,
  projects,
  onDataUpdate,
}: {
  currentData: MarketplaceData | null;
  tokens: Token[];
  projects: Project[];
  onDataUpdate: (data: MarketplaceData) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MarketplaceData>({
    resolver: zodResolver(marketplaceDetailsSchema),
    defaultValues: {
      ...currentData,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (values: MarketplaceData) => {
    onDataUpdate(values);
    navigate(`/app/market/new/sponsor-permissions`);
  };

  // Filtering out MBETA for now. Might not be necessary later on.
  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  return (
    <div className="relative min-h-screen">
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-9 max-w-4xl mx-auto">
        <Container className="py-16 mb-16">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-5">
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
                <Textarea {...register("description")} placeholder="What's the goal of this marketplace?" rows={7} />
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

              <div className="absolute bottom-0 left-0 w-full bg-transparent">
                <Progress.Root
                  value={1}
                  max={5}
                  style={{ height: 1, backgroundColor: "#EDEDED" }}
                  className="mx-auto w-full"
                >
                  <Progress.Indicator className="h-1 bg-blue-500" style={{ width: "20%" }} />
                </Progress.Root>
                <div className="max-w-4xl mx-auto py-4 px-6 flex flex-row gap-4 justify-start">
                  <button disabled className="text-lg text-[#A5A5A5]">
                    <div className="flex flex-row gap-2 items-center text-[#A5A5A5]">
                      <img className="text-[#A5A5A5]" src="/img/left-arrow.svg" alt="" />
                      <span> Prev </span>
                    </div>
                  </button>
                  <button className="text-lg text-[#333333]" type="submit">
                    <div className="flex flex-row gap-2 items-center">
                      <span> Next </span>
                      <img src="/img/right-arrow.svg" alt="" className="" />
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </main>
        </Container>
        <FormStepper
          step={1}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
      </section>
    </div>
  );
}

function FormSteps() {
  return (
    <aside className="py-28 md:w-1/5 hidden md:block">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-text-[#666666] font-bold text-sm">2</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">3</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">4</span>
          </div>
          <div className="border border-[#C9C9C9] h-16"></div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
            <span className="text-[#666666] font-bold text-sm">5</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
