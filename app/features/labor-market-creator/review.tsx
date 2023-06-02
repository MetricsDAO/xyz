import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Combobox, Error, Field, Input, Label, Select, Textarea, FormProgress, FormStepper } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketFactoryInterface__factory, LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import type { GatingData, MarketplaceMeta, MarketplaceForm } from "./schema";
import { MarketplaceFormSchema } from "./schema";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { postNewEvent } from "~/utils/fetch";

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(
  address: string,
  iface: ethers.utils.Interface,
  logs: ethers.providers.Log[],
  eventName: string
) {
  return logs
    .filter((log) => log.address === address)
    .map((log) => iface.parseLog(log))
    .find((e) => e.name === eventName);
}

function configureFromValues(
  contracts: ReturnType<typeof useContracts>,
  inputs: { owner: EvmAddress; cid: string; values: MarketplaceForm }
) {
  const { owner, cid } = inputs;
  const auxilaries = [BigNumber.from(100)];
  const alphas = [BigNumber.from(0), BigNumber.from(25), BigNumber.from(50), BigNumber.from(75), BigNumber.from(90)];
  const betas = [BigNumber.from(0), BigNumber.from(25), BigNumber.from(50), BigNumber.from(75), BigNumber.from(100)];
  const enforcementAddress = contracts.BucketEnforcement.address;

  const sigs: EvmAddress[] = [
    LaborMarket__factory.createInterface().getSighash(
      "submitRequest(uint8,tuple(uint48,uint48,uint48,uint64,uint64,uint256,uint256,address,address),string)"
    ) as EvmAddress,
    LaborMarket__factory.createInterface().getSighash("signal(uint256)") as EvmAddress,
    LaborMarket__factory.createInterface().getSighash("signalReview(uint256,uint24)") as EvmAddress,
  ];
  console.log("VALUES", inputs.values);

  const sponsorBadges = inputs.values.sponsor.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: BigNumber.from(badge.maxBadgeBalance ? badge.maxBadgeBalance : 0),
      points: BigNumber.from(1),
    };
  });

  const analystBadges = inputs.values.analyst.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: BigNumber.from(badge.maxBadgeBalance ? badge.maxBadgeBalance : 0),
      points: BigNumber.from(1),
    };
  });

  const reviewerBadges = inputs.values.reviewer.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: BigNumber.from(badge.maxBadgeBalance ? badge.maxBadgeBalance : 0),
      points: BigNumber.from(1),
    };
  });

  const nodes = [
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.sponsor.numberBadgesRequired || 0),
      badges: sponsorBadges,
    },
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.analyst.numberBadgesRequired || 0),
      badges: analystBadges,
    },
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.reviewer.numberBadgesRequired || 0),
      badges: reviewerBadges,
    },
  ];

  return configureWrite({
    abi: contracts.LaborMarketFactory.abi,
    address: contracts.LaborMarketFactory.address,
    functionName: "createLaborMarket",
    args: [owner, cid, enforcementAddress, auxilaries, alphas, betas, sigs, nodes],
  });
}

export function Review({
  marketplaceData,
  sponsorData,
  analystData,
  reviewerData,
  tokens,
  projects,
}: {
  marketplaceData: MarketplaceMeta | null;
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
    watch,
    formState: { errors },
  } = useForm<MarketplaceForm>({
    defaultValues: {
      meta: {
        ...marketplaceData,
      },
      sponsor: {
        ...sponsorData,
      },
      analyst: {
        ...analystData,
      },
      reviewer: {
        ...reviewerData,
      },
    },
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

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketFactoryInterface__factory.createInterface();
        const event = getEventFromLogs(contracts.LaborMarketFactory.address, iface, receipt.logs, "LaborMarketCreated");
        const newLaborMarketAddress = event?.args["marketAddress"];
        postNewEvent({
          eventFilter: "LaborMarketConfigured",
          address: newLaborMarketAddress,
          blockNumber: receipt.blockNumber,
          transactionHash: receipt.transactionHash,
        }).then(() => navigate(`/app/market/${newLaborMarketAddress}`));
      },
      [contracts.LaborMarketFactory.address, navigate]
    ),
  });

  const onSubmit = (data: MarketplaceForm) => {
    // write to contract with values
    transactor.start({
      metadata: data.meta,
      config: ({ account, cid }) => configureFromValues(contracts, { owner: account, cid, values: data }),
    });
  };

  const onGoBack = () => {
    navigate(`/app/market/new/reviewer-permissions`);
  };

  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  const sponsorGatingType = watch("sponsor.gatingType");
  const analystGatingType = watch("analyst.gatingType");
  const reviewerGatingType = watch("reviewer.gatingType");

  return (
    <div className="flex relative min-h-screen">
      <div className="w-full justify-between flex flex-col">
        <div className="max-w-2xl mx-auto my-16 space-y-10">
          <TxModal
            transactor={transactor}
            title="Create Marketplace"
            confirmationMessage="Confirm that you would like to create a new marketplace."
          />

          <main className="flex-1">
            <form className="space-y-10 py-5">
              <input
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                type="hidden"
                {...register("meta.type", { value: "analyze" })}
              />

              <Field>
                <Label size="lg">Challenge Marketplace Title</Label>
                <Input {...register("meta.title")} type="text" placeholder="e.g Solana Breakpoint 2023" />
                <Error error={errors.meta?.title?.message} />
              </Field>

              <Field>
                <Label size="lg">Details*</Label>
                <Textarea
                  {...register("meta.description")}
                  placeholder="What's the goal of this marketplace?"
                  rows={7}
                />
                <Error error={errors.meta?.description?.message} />
              </Field>

              <Field>
                <Label size="lg">Blockchain/Project(s)*</Label>
                <Controller
                  control={control}
                  name="meta.projectSlugs"
                  render={({ field }) => (
                    <Combobox {...field} options={projects.map((p) => ({ label: p.name, value: p.slug }))} />
                  )}
                />
                <Error error={errors.meta?.projectSlugs?.message} />
              </Field>

              <section>
                <h4 className="font-semibold mb-4">Challenge Rewards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <Label>Reward Token Allowlist</Label>
                    <Controller
                      control={control}
                      name="meta.tokenAllowlist"
                      render={({ field }) => <Combobox {...field} options={tokenAllowlist} />}
                    />
                    <Error error={errors.meta?.tokenAllowlist?.message} />
                  </Field>
                  <Field>
                    <Label>Reward Curve</Label>
                    <Controller
                      control={control}
                      name="meta.enforcement"
                      defaultValue={contracts.BucketEnforcement.address}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[{ label: "Constant Likert", value: contracts.BucketEnforcement.address }]}
                        />
                      )}
                    />
                    <Error error={errors.meta?.enforcement?.message} />
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
                          name={
                            `sponsor.badges[${index}].contractAddress` as `sponsor.badges.${number}.contractAddress`
                          }
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
                          name={
                            `sponsor.badges[${index}].minBadgeBalance` as `sponsor.badges.${number}.minBadgeBalance`
                          }
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
                          name={
                            `sponsor.badges[${index}].maxBadgeBalance` as `sponsor.badges.${number}.maxBadgeBalance`
                          }
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
                        name={
                          `reviewer.badges[${index}].contractAddress` as `reviewer.badges.${number}.contractAddress`
                        }
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
                        name={
                          `reviewer.badges[${index}].minBadgeBalance` as `reviewer.badges.${number}.minBadgeBalance`
                        }
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
                        name={
                          `reviewer.badges[${index}].maxBadgeBalance` as `reviewer.badges.${number}.maxBadgeBalance`
                        }
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
          </main>
        </div>
        <FormProgress
          percent={100}
          onGoBack={onGoBack}
          cancelLink={"/analyze"}
          submitLabel="Create Marketplace"
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
      <aside className="absolute w-1/6 py-28 right-0 top-0">
        <FormStepper
          step={5}
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
