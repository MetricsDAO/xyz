import { zodResolver } from "@hookform/resolvers/zod";
import type { DefaultValues } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Combobox, Error, Field, FormProgress, Input, Label, Select, Textarea } from "~/components";
import type { EvmAddress } from "~/domain/address";
import { useContracts, useProjects, useTokens } from "~/hooks/use-root-data";
import type { MarketplaceForm } from "./schema";
import { MarketplaceFormSchema } from "./schema";

export function OverviewForm({
  defaultValues,
  onPrevious,
  onSubmit,
}: {
  defaultValues?: DefaultValues<MarketplaceForm>;
  onPrevious: () => void;
  onSubmit: (data: MarketplaceForm) => void;
}) {
  const tokens = useTokens();
  const projects = useProjects();
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<MarketplaceForm>({
    defaultValues,
    resolver: zodResolver(MarketplaceFormSchema),
  });

  const contracts = useContracts();

  const sponsorBadges = "sponsor.badges";
  const analystBadges = "analyst.badges";
  const reviewerBadges = "reviewer.badges";

  const {
    fields: sponsorBadgeFields,
    append: appendSponsorBadge,
    remove: removeSponsorBadge,
  } = useFieldArray({
    control,
    name: sponsorBadges,
  });

  const {
    fields: analystBadgeFields,
    append: appendAnalystBadge,
    remove: removeAnalystBadge,
  } = useFieldArray({
    control,
    name: analystBadges,
  });

  const {
    fields: reviewerBadgeFields,
    append: appendReviewerBadge,
    remove: removeReviewerBadge,
  } = useFieldArray({
    control,
    name: reviewerBadges,
  });

  const handleAddSponsorBadge = () => {
    appendSponsorBadge({
      contractAddress: "" as EvmAddress,
      tokenId: 1,
      minBadgeBalance: 1,
      maxBadgeBalance: 0,
    });
  };

  const handleAddAnalystBadge = () => {
    appendAnalystBadge({
      contractAddress: "" as EvmAddress,
      tokenId: 1,
      minBadgeBalance: 1,
      maxBadgeBalance: 0,
    });
  };

  const handleAddReviewerBadge = () => {
    appendReviewerBadge({
      contractAddress: "" as EvmAddress,
      tokenId: 1,
      minBadgeBalance: 1,
      maxBadgeBalance: 0,
    });
  };

  const tokenAllowlist = tokens.map((t) => ({ label: t.name, value: t.symbol }));

  const sponsorGatingType = watch("sponsor.gatingType");
  const analystGatingType = watch("analyst.gatingType");
  const reviewerGatingType = watch("reviewer.gatingType");

  return (
    <div className="w-full justify-between flex flex-col">
      <div className="max-w-2xl mx-auto px-5 my-10 flex-1">
        <form className="space-y-10">
          <input
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            type="hidden"
            {...register("appData.type", { value: "analyze" })}
          />

          <Field>
            <Label size="lg">Challenge Marketplace Title</Label>
            <Input {...register("appData.title")} type="text" placeholder="e.g Solana Breakpoint 2023" />
            <Error error={errors.appData?.title?.message} />
          </Field>

          <Field>
            <Label size="lg">Details*</Label>
            <Textarea
              {...register("appData.description")}
              placeholder="What's the goal of this marketplace?"
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

          <section>
            <h4 className="font-semibold mb-4">Challenge Rewards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <Label>Reward Token Allowlist</Label>
                <Controller
                  control={control}
                  name="appData.tokenAllowlist"
                  render={({ field }) => <Combobox {...field} options={tokenAllowlist} />}
                />
                <Error error={errors.appData?.tokenAllowlist?.message} />
              </Field>
              <Field>
                <Label>Reward Curve</Label>
                <Controller
                  control={control}
                  name="appData.enforcement"
                  defaultValue={contracts.BucketEnforcement.address}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[{ label: "Constant Likert", value: contracts.BucketEnforcement.address }]}
                    />
                  )}
                />
                <Error error={errors.appData?.enforcement?.message} />
              </Field>
            </div>
          </section>

          <h4 className="font-semibold mb-2">Sponsor Permissions</h4>

          <section className="grid grid-cols-1 align-center md:grid-cols-3 gap-6 ">
            <Field>
              <Controller
                control={control}
                name="sponsor.gatingType"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Anyone", value: "Anyone" },
                      { label: "Any", value: "Any" },
                      { label: "All", value: "All" },
                    ]}
                  />
                )}
              />
              <Error error={errors.sponsor?.gatingType?.message} />
            </Field>
            {sponsorGatingType === ("Any" || "All") && (
              <Field>
                <Controller
                  name="sponsor.numberBadgesRequired"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                  )}
                />
                <Error error={errors.sponsor?.numberBadgesRequired?.message} />
              </Field>
            )}
            {sponsorGatingType === ("Any" || "All") ? (
              <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
            ) : (
              <span className="text-xs text-black-[#4D4D4D]"> Can launch challenges in this marketplace. </span>
            )}
          </section>

          {/* Render sponsorBadges array */}
          <div className="mb-2">
            {sponsorBadgeFields.map((field, index) => (
              <div key={field.id}>
                <section className="grid grid-cols-1 align-center md:grid-cols-6 gap-6 items-center">
                  <Field className="col-span-2">
                    <Label size="sm">Contract Address</Label>
                    <Controller
                      name={`sponsor.badges[${index}].contractAddress` as `sponsor.badges.${number}.contractAddress`}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                      )}
                    />
                    <Error error={errors.sponsor?.badges?.[index]?.contractAddress?.message} />
                  </Field>
                  <Field>
                    <Label size="sm">token ID</Label>
                    <Controller
                      name={`sponsor.badges[${index}].tokenId` as `sponsor.badges.${number}.tokenId`}
                      control={control}
                      defaultValue={field.tokenId}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                      )}
                    />
                    <Error error={errors.sponsor?.badges?.[index]?.tokenId?.message} />
                  </Field>
                  <Field>
                    <Label size="sm">Min</Label>
                    <Controller
                      name={`sponsor.badges[${index}].minBadgeBalance` as `sponsor.badges.${number}.minBadgeBalance`}
                      control={control}
                      defaultValue={field.minBadgeBalance}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                      )}
                    />
                    <Error error={errors.sponsor?.badges?.[index]?.minBadgeBalance?.message} />
                  </Field>
                  <Field>
                    <Label size="sm">Max</Label>
                    <Controller
                      name={`sponsor.badges[${index}].maxBadgeBalance` as `sponsor.badges.${number}.maxBadgeBalance`}
                      control={control}
                      defaultValue={field.maxBadgeBalance}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                      )}
                    />
                    <Error error={errors.sponsor?.badges?.[index]?.maxBadgeBalance?.message} />
                  </Field>
                  <button className="mt-8" type="button" onClick={() => removeSponsorBadge(index)}>
                    <img className="h-[24px] w-[24px]" src="/img/remove.svg" alt="" />
                  </button>
                </section>
              </div>
            ))}

            {sponsorGatingType !== "Anyone" && (
              <section>
                <button className="text-blue-500" type="button" onClick={handleAddSponsorBadge}>
                  + Add Badge
                </button>
              </section>
            )}
          </div>

          <h4 className="font-semibold mb-2">Analyst Permissions</h4>

          <section className="grid grid-cols-1 align-center md:grid-cols-3 gap-6 ">
            <Field>
              <Controller
                control={control}
                name="analyst.gatingType"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Anyone", value: "Anyone" },
                      { label: "Any", value: "Any" },
                      { label: "All", value: "All" },
                    ]}
                  />
                )}
              />
              <Error error={errors.analyst?.gatingType?.message} />
            </Field>
            {analystGatingType === ("Any" || "All") && (
              <Field>
                <Controller
                  name="analyst.numberBadgesRequired"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                  )}
                />
                <Error error={errors.analyst?.numberBadgesRequired?.message} />
              </Field>
            )}
            {analystGatingType === ("Any" || "All") ? (
              <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
            ) : (
              <span className="text-xs text-black-[#4D4D4D]"> Can enter submissions in this marketplace. </span>
            )}
          </section>
          {/* Render sponsorBadges array */}

          {analystBadgeFields.map((field, index) => (
            <div key={field.id}>
              <section className="grid grid-cols-1 align-center md:grid-cols-6 gap-6 items-center">
                <Field className="col-span-2">
                  <Label size="sm">Contract Address</Label>
                  <Controller
                    name={`analyst.badges[${index}].contractAddress` as `analyst.badges.${number}.contractAddress`}
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                    )}
                  />
                  <Error error={errors.analyst?.badges?.[index]?.contractAddress?.message} />
                </Field>
                <Field>
                  <Label size="sm">token ID</Label>
                  <Controller
                    name={`analyst.badges[${index}].tokenId` as `analyst.badges.${number}.tokenId`}
                    control={control}
                    defaultValue={field.tokenId}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.analyst?.badges?.[index]?.tokenId?.message} />
                </Field>
                <Field>
                  <Label size="sm">Min</Label>
                  <Controller
                    name={`analyst.badges[${index}].minBadgeBalance` as `analyst.badges.${number}.minBadgeBalance`}
                    control={control}
                    defaultValue={field.minBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.analyst?.badges?.[index]?.minBadgeBalance?.message} />
                </Field>
                <Field>
                  <Label size="sm">Max</Label>
                  <Controller
                    name={`analyst.badges[${index}].maxBadgeBalance` as `analyst.badges.${number}.maxBadgeBalance`}
                    control={control}
                    defaultValue={field.maxBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.analyst?.badges?.[index]?.maxBadgeBalance?.message} />
                </Field>
                <button className="mt-8" type="button" onClick={() => removeAnalystBadge(index)}>
                  <img className="h-[24px] w-[24px]" src="/img/remove.svg" alt="" />
                </button>
              </section>
            </div>
          ))}

          {analystGatingType !== "Anyone" && (
            <section>
              <button className="text-blue-500" type="button" onClick={handleAddAnalystBadge}>
                + Add Badge
              </button>
            </section>
          )}

          <h4 className="font-semibold mb-2">Reviewer Permissions</h4>

          <section className="grid grid-cols-1 align-center md:grid-cols-3 gap-6 ">
            <Field>
              <Controller
                control={control}
                name="reviewer.gatingType"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Anyone", value: "Anyone" },
                      { label: "Any", value: "Any" },
                      { label: "All", value: "All" },
                    ]}
                  />
                )}
              />
              <Error error={errors.reviewer?.gatingType?.message} />
            </Field>
            {reviewerGatingType === ("Any" || "All") && (
              <Field>
                <Controller
                  name="reviewer.numberBadgesRequired"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                  )}
                />
                <Error error={errors.reviewer?.numberBadgesRequired?.message} />
              </Field>
            )}
            {reviewerGatingType === ("Any" || "All") ? (
              <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
            ) : (
              <span className="text-xs text-black-[#4D4D4D]"> Can review challenges in this marketplace. </span>
            )}{" "}
          </section>
          {/* Render sponsorBadges array */}

          {reviewerBadgeFields.map((field, index) => (
            <div key={field.id}>
              <section className="grid grid-cols-1 align-center md:grid-cols-6 gap-6 items-center">
                <Field className="col-span-2">
                  <Label size="sm">Contract Address</Label>
                  <Controller
                    name={`reviewer.badges[${index}].contractAddress` as `reviewer.badges.${number}.contractAddress`}
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                    )}
                  />
                  <Error error={errors.reviewer?.badges?.[index]?.contractAddress?.message} />
                </Field>
                <Field>
                  <Label size="sm">token ID</Label>
                  <Controller
                    name={`reviewer.badges[${index}].tokenId` as `reviewer.badges.${number}.tokenId`}
                    control={control}
                    defaultValue={field.tokenId}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.reviewer?.badges?.[index]?.tokenId?.message} />
                </Field>
                <Field>
                  <Label size="sm">Min</Label>
                  <Controller
                    name={`reviewer.badges[${index}].minBadgeBalance` as `reviewer.badges.${number}.minBadgeBalance`}
                    control={control}
                    defaultValue={field.minBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.reviewer?.badges?.[index]?.minBadgeBalance?.message} />
                </Field>
                <Field>
                  <Label size="sm">Max</Label>
                  <Controller
                    name={`reviewer.badges[${index}].maxBadgeBalance` as `reviewer.badges.${number}.maxBadgeBalance`}
                    control={control}
                    defaultValue={field.maxBadgeBalance}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.reviewer?.badges?.[index]?.maxBadgeBalance?.message} />
                </Field>
                <button className="mt-8" type="button" onClick={() => removeReviewerBadge(index)}>
                  <img className="h-[24px] w-[24px]" src="/img/remove.svg" alt="" />
                </button>
              </section>
            </div>
          ))}

          {reviewerGatingType !== "Anyone" && (
            <section>
              <button className="text-blue-500" type="button" onClick={handleAddReviewerBadge}>
                + Add Badge
              </button>
            </section>
          )}
        </form>
      </div>
      <FormProgress
        percent={100}
        cancelLink={"/analyze"}
        submitLabel="Create Marketplace"
        onGoBack={onPrevious}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
