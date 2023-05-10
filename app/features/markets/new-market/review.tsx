import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GatingData, MarketplaceData, finalMarketData } from "~/domain/labor-market/schemas";
import { finalMarketSchema } from "~/domain/labor-market/schemas";
import { Container, Field, Input, Label, Error, Textarea, Combobox, Select, Button } from "~/components";
import * as Progress from "@radix-ui/react-progress";
import type { Project, Token } from "@prisma/client";
import { useContracts } from "~/hooks/use-root-data";
import type { EvmAddress } from "~/domain/address";
import { Link, useNavigate } from "@remix-run/react";

export function FinalStep({
  marketplaceData,
  sponsorData,
  analystData,
  reviewerData,
  tokens,
  projects,
}: {
  marketplaceData: MarketplaceData | null;
  sponsorData: GatingData | null;
  analystData: GatingData | null;
  reviewerData: GatingData | null;
  tokens: Token[];
  projects: Project[];
}) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<finalMarketData>({
    defaultValues: {
      marketplaceData: {
        ...marketplaceData,
      },
      sponsorData: {
        ...sponsorData,
      },
      analystData: {
        ...analystData,
      },
      reviewerData: {
        ...reviewerData,
      },
    },
    resolver: zodResolver(finalMarketSchema),
  });

  const contracts = useContracts();

  const sponsorBadges = "sponsorData.badges";
  const analystBadges = "analystData.badges";
  const reviewerBadges = "reviewerData.badges";

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
      type: "Badge",
      contractAddress: "" as EvmAddress,
      tokenId: "",
      minBadgeBalance: 1,
      maxBadgeBalance: undefined,
    });
  };

  const handleAddAnalystBadge = () => {
    appendAnalystBadge({
      type: "Badge",
      contractAddress: "" as EvmAddress,
      tokenId: "",
      minBadgeBalance: 1,
      maxBadgeBalance: undefined,
    });
  };

  const handleAddReviewerBadge = () => {
    appendReviewerBadge({
      type: "Badge",
      contractAddress: "" as EvmAddress,
      tokenId: "",
      minBadgeBalance: 1,
      maxBadgeBalance: undefined,
    });
  };

  const navigate = useNavigate();

  const onSubmit = (data: finalMarketData) => {
    console.log(data);
    // write to contract with values
  };

  const onGoBack = () => {
    navigate(`/app/market/new2/reviewer-permissions`);
  };

  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  return (
    <div className="relative min-h-screen">
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-9 max-w-4xl mx-auto">
        <Container className="py-8 mb-16">
          <main className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-5">
              <input
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                type="hidden"
                {...register("marketplaceData.type", { value: "analyze" })}
              />

              <Field>
                <Label size="lg">Challenge Marketplace Title</Label>
                <Input {...register("marketplaceData.title")} type="text" placeholder="e.g Solana Breakpoint 2023" />
                <Error error={errors.marketplaceData?.title?.message} />
              </Field>

              <Field>
                <Label size="lg">Details*</Label>
                <Textarea
                  {...register("marketplaceData.description")}
                  placeholder="What's the goal of this marketplace?"
                  rows={7}
                />
                <Error error={errors.marketplaceData?.description?.message} />
              </Field>

              <Field>
                <Label size="lg">Blockchain/Project(s)*</Label>
                <Controller
                  control={control}
                  name="marketplaceData.projectSlugs"
                  render={({ field }) => (
                    <Combobox {...field} options={projects.map((p) => ({ label: p.name, value: p.slug }))} />
                  )}
                />
                <Error error={errors.marketplaceData?.projectSlugs?.message} />
              </Field>

              <section>
                <h4 className="font-semibold mb-4">Challenge Rewards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <Label>Reward Token Allowlist</Label>
                    <Controller
                      control={control}
                      name="marketplaceData.tokenAllowlist"
                      render={({ field }) => <Combobox {...field} options={tokenAllowlist} />}
                    />
                    <Error error={errors.marketplaceData?.tokenAllowlist?.message} />
                  </Field>
                  <Field>
                    <Label>Reward Curve</Label>
                    <Controller
                      control={control}
                      name="marketplaceData.enforcement"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[{ label: "Constant Likert", value: contracts.ScalableLikertEnforcement.address }]}
                        />
                      )}
                    />
                    <Error error={errors.marketplaceData?.enforcement?.message} />
                  </Field>
                </div>
              </section>

              <h4 className="font-semibold mb-2">Sponsor Permissions</h4>

              <section className="grid grid-cols-1 align-center md:grid-cols-3 gap-6 ">
                <Field>
                  <Controller
                    control={control}
                    name="sponsorData.gatingType"
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
                  <Error error={errors.sponsorData?.gatingType?.message} />
                </Field>
                <Field>
                  <Controller
                    name="sponsorData.numberBadgesRequired"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" />
                    )}
                  />
                  <Error error={errors.sponsorData?.numberBadgesRequired?.message} />
                </Field>
                <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
              </section>
              {/* Render sponsorBadges array */}

              <div className="mb-2">
                {sponsorBadgeFields.map((field, index) => (
                  <div key={field.id}>
                    <section className="grid grid-cols-1 align-center md:grid-cols-5 gap-6">
                      <Field>
                        <Label size="sm">Contract Address</Label>
                        <Controller
                          name={
                            `sponsorData.badges[${index}].contractAddress` as `sponsorData.badges.${number}.contractAddress`
                          }
                          control={control}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                          )}
                        />
                        <Error error={errors.sponsorData?.badges?.[index]?.contractAddress?.message} />
                      </Field>
                      <Field>
                        <Label size="sm">token ID</Label>
                        <Controller
                          name={`sponsorData.badges[${index}].tokenId` as `sponsorData.badges.${number}.tokenId`}
                          control={control}
                          defaultValue={field.tokenId}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                          )}
                        />
                        <Error error={errors.sponsorData?.badges?.[index]?.tokenId?.message} />
                      </Field>
                      <Field>
                        <Label size="sm">Min</Label>
                        <Controller
                          name={
                            `sponsorData.badges[${index}].minBadgeBalance` as `sponsorData.badges.${number}.minBadgeBalance`
                          }
                          control={control}
                          defaultValue={field.minBadgeBalance}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                          )}
                        />
                        <Error error={errors.sponsorData?.badges?.[index]?.minBadgeBalance?.message} />
                      </Field>
                      <Field>
                        <Label size="sm">Max</Label>
                        <Controller
                          name={
                            `sponsorData.badges[${index}].maxBadgeBalance` as `sponsorData.badges.${number}.maxBadgeBalance`
                          }
                          control={control}
                          defaultValue={field.maxBadgeBalance}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                          )}
                        />
                        <Error error={errors.sponsorData?.badges?.[index]?.maxBadgeBalance?.message} />
                      </Field>
                      <button type="button" onClick={() => removeSponsorBadge(index)}>
                        Remove
                      </button>
                    </section>
                  </div>
                ))}

                {sponsorData?.gatingType !== "Anyone" && (
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
                    name="analystData.gatingType"
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
                  <Error error={errors.analystData?.gatingType?.message} />
                </Field>
                <Field>
                  <Controller
                    name="analystData.numberBadgesRequired"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.analystData?.numberBadgesRequired?.message} />
                </Field>
                <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
              </section>
              {/* Render sponsorBadges array */}

              {analystBadgeFields.map((field, index) => (
                <div key={field.id}>
                  <section className="grid grid-cols-1 align-center md:grid-cols-5 gap-6">
                    <Field>
                      <Label size="sm">Contract Address</Label>
                      <Controller
                        name={
                          `analystData.badges[${index}].contractAddress` as `analystData.badges.${number}.contractAddress`
                        }
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                        )}
                      />
                      <Error error={errors.analystData?.badges?.[index]?.contractAddress?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">token ID</Label>
                      <Controller
                        name={`analystData.badges[${index}].tokenId` as `analystData.badges.${number}.tokenId`}
                        control={control}
                        defaultValue={field.tokenId}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.analystData?.badges?.[index]?.tokenId?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">Min</Label>
                      <Controller
                        name={
                          `analystData.badges[${index}].minBadgeBalance` as `analystData.badges.${number}.minBadgeBalance`
                        }
                        control={control}
                        defaultValue={field.minBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.analystData?.badges?.[index]?.minBadgeBalance?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">Max</Label>
                      <Controller
                        name={
                          `analystData.badges[${index}].maxBadgeBalance` as `analystData.badges.${number}.maxBadgeBalance`
                        }
                        control={control}
                        defaultValue={field.maxBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.analystData?.badges?.[index]?.maxBadgeBalance?.message} />
                    </Field>
                    <button type="button" onClick={() => removeAnalystBadge(index)}>
                      Remove
                    </button>
                  </section>
                </div>
              ))}

              {analystData?.gatingType !== "Anyone" && (
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
                    name="reviewerData.gatingType"
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
                  <Error error={errors.reviewerData?.gatingType?.message} />
                </Field>
                <Field>
                  <Controller
                    name="reviewerData.numberBadgesRequired"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.reviewerData?.numberBadgesRequired?.message} />
                </Field>
                <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
              </section>
              {/* Render sponsorBadges array */}

              {reviewerBadgeFields.map((field, index) => (
                <div key={field.id}>
                  <section className="grid grid-cols-1 align-center md:grid-cols-5 gap-6">
                    <Field>
                      <Label size="sm">Contract Address</Label>
                      <Controller
                        name={
                          `reviewerData.badges[${index}].contractAddress` as `reviewerData.badges.${number}.contractAddress`
                        }
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                        )}
                      />
                      <Error error={errors.reviewerData?.badges?.[index]?.contractAddress?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">token ID</Label>
                      <Controller
                        name={`reviewerData.badges[${index}].tokenId` as `reviewerData.badges.${number}.tokenId`}
                        control={control}
                        defaultValue={field.tokenId}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.reviewerData?.badges?.[index]?.tokenId?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">Min</Label>
                      <Controller
                        name={
                          `reviewerData.badges[${index}].minBadgeBalance` as `reviewerData.badges.${number}.minBadgeBalance`
                        }
                        control={control}
                        defaultValue={field.minBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.reviewerData?.badges?.[index]?.minBadgeBalance?.message} />
                    </Field>
                    <Field>
                      <Label size="sm">Max</Label>
                      <Controller
                        name={
                          `reviewerData.badges[${index}].maxBadgeBalance` as `reviewerData.badges.${number}.maxBadgeBalance`
                        }
                        control={control}
                        defaultValue={field.maxBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                      <Error error={errors.reviewerData?.badges?.[index]?.maxBadgeBalance?.message} />
                    </Field>
                    <button type="button" onClick={() => removeReviewerBadge(index)}>
                      Remove
                    </button>
                  </section>
                </div>
              ))}

              {reviewerData?.gatingType !== "Anyone" && (
                <section>
                  <button className="text-blue-500" type="button" onClick={handleAddReviewerBadge}>
                    + Add Badge
                  </button>
                </section>
              )}

              <div className="absolute bottom-0 left-0 w-full bg-transparent">
                <Progress.Root
                  value={1}
                  max={5}
                  style={{ height: 1, backgroundColor: "#EDEDED" }}
                  className="mx-auto w-full"
                >
                  <Progress.Indicator className="h-1 bg-blue-500" style={{ width: "100%" }} />
                </Progress.Root>
                {/* <div className="flex flex-row items-center"> */}
                <div className="max-w-4xl text-lg mx-auto py-4 gap-6 flex justify-between items-center">
                  <div className="max-w-4xl py-4 px-6 flex flex-row gap-4">
                    <button onClick={onGoBack} type="button" className="text-lg text-[#333333]">
                      <div className="flex flex-row gap-2 items-center">
                        <img src="/img/left-arrow.svg" alt="" />
                        <span> Prev </span>
                      </div>
                    </button>
                    <button disabled className="text-lg text-[#A5A5A5]" type="submit">
                      <div className="flex flex-row gap-2 items-center">
                        <span> Next </span>
                        <img src="/img/right-arrow.svg" alt="" className="" />
                      </div>
                    </button>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button onClick={() => navigate(`/app`)} variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Create Marketplace</Button>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </Container>
        <FormSteps />
      </section>
    </div>
  );
}

function FormSteps() {
  return (
    <aside className="py-28 md:w-1/3 hidden md:block">
      <div className="flex flex-col items-start justify-start gap-4 ">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full border border-[#A5A5A5] bg-transparent">
              <span className="text-[#666666] font-bold text-sm">1</span>
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
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
              <span className="text-white font-bold text-sm">5</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center flex-shrink-0">
          <div className="flex flex-row items-center space-x-1">
            <img src="/img/information.svg" alt="" />
            <Link className="text-[#116FDE] font-bold text-xs" to="https://www.trybadger.com/dashboard/">
              Launch Badger
            </Link>
            <div className="text-[#116FDE] mx-2">|</div>
            <Link className="text-[#116FDE] font-bold text-xs" to="https://docs.trybadger.com/">
              Badger Docs
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
