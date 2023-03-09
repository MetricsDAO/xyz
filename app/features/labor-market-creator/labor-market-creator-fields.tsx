import type { Project, Token } from "@prisma/client";
import { ScalableLikertEnforcement } from "labor-markets-abi";
import { Controller, useFormContext } from "react-hook-form";
import { Field, Label, Textarea, Button, Select, Input, Error, Combobox } from "~/components";
import type { LaborMarketFormValues } from "./labor-market-creator-values";

function AnalyticsDescription() {
  return (
    <section className="space-y-1">
      <p className="text-cyan-500 text-lg">
        Tap the world’s best Web3 analyst community to deliver quality analytics, tooling, or content that helps
        projects launch, grow and succeed.
      </p>
      <p className="text-sm text-gray-500">
        Define user permissions, blockchain/project and reward token allowlists, and the reward curve. These parameters
        will be applied to all challenges in this marketplace.
      </p>
    </section>
  );
}

function BrainstormDescription() {
  return (
    <section className="space-y-1">
      <p className="text-cyan-500 text-lg">
        Source and prioritize questions, problems, or tooling needs for Web3 analysts to address.
      </p>
      <p className="text-sm text-gray-500">
        Define user permissions, blockchain/project and reward token allowlists, and the reward curve. These parameters
        will be applied to all challenges in this marketplace.
      </p>
    </section>
  );
}

export function LaborMarketCreatorFields({
  projects,
  type,
  tokens,
}: {
  projects: Project[];
  type?: string;
  tokens: Token[];
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<LaborMarketFormValues>();

  return (
    <>
      {type === "brainstorm" ? <BrainstormDescription /> : <AnalyticsDescription />}

      <input type="hidden" name="type" value={type} />

      <Field>
        <Label size="lg">Challenge Marketplace Title*</Label>
        <Input {...register("appData.title")} type="text" placeholder="e.g Solana Breakpoint 2023" />
        <Error error={errors.appData?.title?.message} />
      </Field>

      <Field>
        <Label size="lg">Details*</Label>
        <Textarea
          {...register("appData.description")}
          placeholder={`What's the goal of this ${type === "brainstorm" ? "Brainstorm" : "Analytics"} marketplace?`}
          rows={7}
        />
        <Error error={errors.appData?.description?.message} />
      </Field>

      <Field>
        <Label size="lg">Blockchain/Project(s)*</Label>
        <Controller
          control={control}
          name="appData.projectSlugs"
          render={({ field }) => (
            <Combobox {...field} options={projects.map((p) => ({ label: p.name, value: p.slug }))} />
          )}
        />
        <Error error={errors.appData?.projectSlugs?.message} />
      </Field>

      <section className="space-y-4">
        <Field>
          <div className="flex items-center">
            <Label size="lg" className="mr-auto">
              Who has permission to launch challenges?*
            </Label>
            <p className="flex text-sm space-x-3">
              <Button variant="link" size="none" asChild>
                <a href="https://www.trybadger.com/" target="_blank" rel="noreferrer">
                  Launch Badger
                </a>
              </Button>
              <Button variant="link" size="none" asChild>
                <a href="https://flipside-crypto.gitbook.io/badger/what-is-badger" target="_blank" rel="noreferrer">
                  Badger Docs
                </a>
              </Button>
            </p>
          </div>
          <Controller
            name="delegatePermission"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  options={[
                    { label: "Anyone", value: "anyone" }, // Not for MVP
                    { label: "Delegates only", value: "delegates" },
                  ]}
                />
              );
            }}
          />
          <Error error={errors.delegatePermission?.message} />
        </Field>

        {watch("delegatePermission") === "delegates" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <Label>Badger Contract Address*</Label>
              <Input {...register("configuration.delegateBadge.token")} />
              <Error error={errors.configuration?.delegateBadge?.token?.message} />
            </Field>
            <Field>
              <Label>Badger Token ID*</Label>
              <Input {...register("configuration.delegateBadge.tokenId")} />
              <Error error={errors.configuration?.delegateBadge?.tokenId?.message} />
            </Field>
          </div>
        ) : null}
      </section>

      <section>
        <h4 className="font-semibold mb-4">Challenge Rewards</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Reward Token Allowlist</Label>
            <Controller
              control={control}
              name="configuration.modules.enforcement"
              render={({ field }) => (
                <Select {...field} options={tokens.map((t) => ({ label: t.name, value: t.symbol }))} />
              )}
            />
            <Error error={errors.appData?.tokenAllowlist?.message} />
          </Field>
          <Field>
            <Label>Reward Curve</Label>
            <Controller
              control={control}
              name="configuration.modules.enforcement"
              render={({ field }) => (
                <Select {...field} options={[{ label: "Scalable Likert", value: ScalableLikertEnforcement.address }]} />
              )}
            />
            <Error error={errors.configuration?.modules?.enforcement?.message} />
          </Field>
        </div>
      </section>

      <section>
        <h4 className="font-semibold mb-4">Control who has permission to submit on challenges</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Minimum rMETRIC Balance*</Label>
            <Input {...register("configuration.reputationParams.submitMin")} />
            <Error error={errors.configuration?.reputationParams?.submitMin?.message} />
          </Field>
          <Field>
            <Label>Maximum rMETRIC Balance</Label>
            <Input {...register("configuration.reputationParams.submitMax")} />
            <Error error={errors.configuration?.reputationParams?.submitMax?.message} />
          </Field>
        </div>
      </section>

      <Field>
        <Label size="lg">Control who has permission to review challenge submissions</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Reviewer Badger Contract Address*</Label>
            <Input {...register("configuration.maintainerBadge.token")} placeholder="0x..." />
            <Error error={errors.configuration?.maintainerBadge?.token?.message} />
          </Field>
          <Field>
            <Label>Reviewer Badger Token ID*</Label>
            <Input {...register("configuration.maintainerBadge.tokenId")} placeholder="0x..." />
            <Error error={errors.configuration?.maintainerBadge?.tokenId?.message} />
          </Field>
        </div>
      </Field>
    </>
  );
}
