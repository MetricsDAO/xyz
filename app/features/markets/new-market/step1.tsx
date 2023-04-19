import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { useNavigate, useOutletContext } from "@remix-run/react";
import { Controller, useForm } from "react-hook-form";
import { Combobox, Container, Error, Field, Input, Label, Select, Textarea } from "~/components";
import { Button } from "~/components/button";
import type { step1Data } from "~/domain/labor-market/schemas";
import { step1Schema } from "~/domain/labor-market/schemas";
import { useContracts } from "~/hooks/use-root-data";
import type { step1DataType } from "~/routes/app+/market_.new2";

export function Step1({ tokens, projects }: { tokens: Token[]; projects: Project[] }) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const onSubmit = (values: step1Data) => {
    console.log("values", values);
    navigate("step2");
  };

  // Filtering out MBETA for now. Might not be necessary later on.
  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-5">
          <input type="hidden" {...register("type", { value: "analyze" })} />

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
                      options={[{ label: "Constant Likert", value: contracts.ScalableLikertEnforcement.address }]}
                    />
                  )}
                />
                <Error error={errors.enforcement?.message} />
              </Field>
            </div>
          </section>

          <Button size="lg" type="submit">
            Next
          </Button>
        </form>
      </div>
    </Container>
  );
}
