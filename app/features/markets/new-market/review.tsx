import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { finalMarketData, step1Data, step2Data } from "~/domain/labor-market/schemas";
import { finalMarketSchema } from "~/domain/labor-market/schemas";
import { Container, Field, Input, Label, Error, Textarea, Combobox, Select, Button } from "~/components";
import * as Progress from "@radix-ui/react-progress";
import type { Project, Token } from "@prisma/client";
import { useContracts } from "~/hooks/use-root-data";
import type { EvmAddress } from "~/domain/address";
import { useNavigate } from "@remix-run/react";

export function FinalStep({
  page1Data,
  page2Data,
  page3Data,
  page4Data,
  tokens,
  projects,
}: {
  page1Data: step1Data | null;
  page2Data: step2Data | null;
  page3Data: step2Data | null;
  page4Data: step2Data | null;
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
      page1Data: {
        type: "analyze",
        title: "",
        description: "",
        projectSlugs: [],
        tokenAllowlist: [],
        enforcement: "" as EvmAddress,
      },
      page2Data: {
        numberBadgesRequired: 1,
        gatingType: "Any",
        badges: [],
      },
      page3Data: {
        ...page3Data,
      },
      page4Data: {
        ...page4Data,
      },
    },
    resolver: zodResolver(finalMarketSchema),
  });

  const contracts = useContracts();

  const sponsorBadges = "page2Data.badges";
  const analystBadges = "page3Data.badges";
  const reviewerBadges = "page4Data.badges";

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

  const onSubmit = (data: finalMarketData) => {
    console.log(data);
    // submit data to server
  };

  const navigate = useNavigate();

  const onGoBack = () => {
    navigate(`/app/market/new2/step4`);
  };

  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  return (
    <div className="relative min-h-screen">
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-9 max-w-4xl mx-auto">
        <Container className="py-8 mb-8">
          <main className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-5">
              <input
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                type="hidden"
                {...register("page1Data.type", { value: "analyze" })}
              />

              <Field>
                <Label size="lg">Challenge Marketplace Title</Label>
                <Input {...register("page1Data.title")} type="text" placeholder="e.g Solana Breakpoint 2023" />
                <Error error={errors.page1Data?.title?.message} />
              </Field>

              <Field>
                <Label size="lg">Details*</Label>
                <Textarea
                  {...register("page1Data.description")}
                  placeholder="What's the goal of this marketplace?"
                  rows={7}
                />
                <Error error={errors.page1Data?.description?.message} />
              </Field>

              <Field>
                <Label size="lg">Blockchain/Project(s)*</Label>
                <Controller
                  control={control}
                  name="page1Data.projectSlugs"
                  render={({ field }) => (
                    <Combobox {...field} options={projects.map((p) => ({ label: p.name, value: p.slug }))} />
                  )}
                />
                <Error error={errors.page1Data?.projectSlugs?.message} />
              </Field>

              <section>
                <h4 className="font-semibold mb-4">Challenge Rewards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <Label>Reward Token Allowlist</Label>
                    <Controller
                      control={control}
                      name="page1Data.tokenAllowlist"
                      render={({ field }) => <Combobox {...field} options={tokenAllowlist} />}
                    />
                    <Error error={errors.page1Data?.tokenAllowlist?.message} />
                  </Field>
                  <Field>
                    <Label>Reward Curve</Label>
                    <Controller
                      control={control}
                      name="page1Data.enforcement"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[{ label: "Constant Likert", value: contracts.ScalableLikertEnforcement.address }]}
                        />
                      )}
                    />
                    <Error error={errors.page1Data?.enforcement?.message} />
                  </Field>
                </div>
              </section>

              <h4 className="font-semibold mb-4">Sponsor Permissions</h4>

              <section className="grid grid-cols-1 align-center md:grid-cols-3 gap-6 ">
                <Field>
                  <Controller
                    control={control}
                    name="page2Data.gatingType"
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
                  <Error error={errors.page2Data?.gatingType?.message} />
                </Field>
                <Field>
                  <Controller
                    name="page2Data.numberBadgesRequired"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                    )}
                  />
                  <Error error={errors.page2Data?.numberBadgesRequired?.message} />
                </Field>
                <span className="text-xs text-black-[#4D4D4D]"> of the following criteria needs to be met. </span>
              </section>
              {/* Render sponsorBadges array */}

              {sponsorBadgeFields.map((field, index) => (
                <div key={field.id}>
                  <section className="grid grid-cols-1 align-center md:grid-cols-5 gap-6">
                    {/* <Field>
                  <Label size="sm">Type</Label>
                  <Controller
                    name={`sponsorBadges[${index}].type` as keyof step2Data}
                    control={control}
                    render={({ field }) => <Select {...field} options={[{ label: "Badge", value: "Badge" }]} />}
                  />
                </Field> */}
                    <Field>
                      <Label size="sm">Contract Address</Label>
                      <Controller
                        name={
                          `page2Data.badges[${index}].contractAddress` as `page2Data.badges.${number}.contractAddress`
                        }
                        control={control}
                        // defaultValue="0x0000000000000000000000000000000000000000"
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="text" />
                        )}
                      />
                    </Field>
                    <Field>
                      <Label size="sm">token ID</Label>
                      <Controller
                        name={`page2Data.badges[${index}].tokenId` as `page2Data.badges.${number}.tokenId`}
                        control={control}
                        defaultValue={field.tokenId}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                    </Field>
                    <Field>
                      <Label size="sm">Min</Label>
                      <Controller
                        name={
                          `page2Data.badges[${index}].minBadgeBalance` as `page2Data.badges.${number}.minBadgeBalance`
                        }
                        control={control}
                        defaultValue={field.minBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                    </Field>
                    <Field>
                      <Label size="sm">Max</Label>
                      <Controller
                        name={
                          `page2Data.badges[${index}].maxBadgeBalance` as `page2Data.badges.${number}.maxBadgeBalance`
                        }
                        control={control}
                        defaultValue={field.maxBadgeBalance}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                        )}
                      />
                    </Field>
                    <button type="button" onClick={() => removeSponsorBadge(index)}>
                      Remove
                    </button>
                  </section>
                </div>
              ))}

              {page2Data?.gatingType !== "Anyone" && (
                <section>
                  <button className="text-blue-500" type="button" onClick={handleAddSponsorBadge}>
                    + Add Type
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
                <div className="max-w-4xl text-lg mx-auto py-4 gap-6 flex justify-between">
                  <button onClick={onGoBack} type="button">
                    Back
                  </button>
                  <Button type="submit">Create Marketplace</Button>
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
    <aside className="py-28 md:w-1/5 hidden md:block">
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
    </aside>
  );
}
