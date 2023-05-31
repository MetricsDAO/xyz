import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";
import { Combobox, Error, Field, Input, Label, Select, Textarea, FormProgress, FormStepper } from "~/components";
import { CurveChart } from "~/components/curve-chart";
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
    watch,
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

  const enforcement = watch("enforcement");

  return (
    <div className="flex relative min-h-screen">
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

              {enforcement && <CurveChart type={"Constant"} />}
            </form>
          </main>
        </div>
        <FormProgress percent={20} onNext={handleSubmit(onSubmit)} cancelLink={"/appp/analyze"} />
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper
          step={1}
          labels={["Create", "Sponsor Permissions", "Author Permissions", "Reviewer Permissios", "Overview"]}
        />
        <div className="flex mt-16 gap-x-2 items-center">
          <InformationCircleIcon className="h-6 w-6 mr-2" />
          <Link to={"https://www.trybadger.com/"} className="text-sm text-blue-600">
            Launch Badger
          </Link>
          <p className="text-sm text-blue-600">|</p>
          <Link to={"https://docs.trybadger.com/"} className="text-sm text-blue-600">
            Badger Docs
          </Link>
        </div>
      </aside>
    </div>
  );
}
