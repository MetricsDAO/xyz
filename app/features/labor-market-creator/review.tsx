import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Combobox,
  Error,
  Field,
  Input,
  Label,
  Select,
  Textarea,
  FormProgress,
  FormStepper,
  Button,
} from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketFactoryInterface__factory, LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import type { GatingData, MarketplaceData, finalMarketData } from "~/domain/labor-market/schemas";
import { finalMarketSchema } from "~/domain/labor-market/schemas";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(
  address: string,
  iface: ethers.utils.Interface,
  logs: ethers.providers.Log[],
  eventName: string
) {
  console.log("logs", logs);
  console.log("address", address);
  console.log("eventName", eventName);
  return logs
    .filter((log) => log.address === address)
    .map((log) => iface.parseLog(log))
    .find((e) => e.name === eventName);
}

function configureFromValues(
  contracts: ReturnType<typeof useContracts>,
  inputs: { owner: EvmAddress; cid: string; values: finalMarketData }
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

  const sponsorBadges = inputs.values.sponsorData.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: BigNumber.from(badge.maxBadgeBalance ? badge.maxBadgeBalance : 0),
      points: BigNumber.from(1),
    };
  });

  const analystBadges = inputs.values.analystData.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: BigNumber.from(badge.maxBadgeBalance ? badge.maxBadgeBalance : 0),
      points: BigNumber.from(1),
    };
  });

  const reviewerBadges = inputs.values.reviewerData.badges.map((badge) => {
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
      required: BigNumber.from(inputs.values.sponsorData.numberBadgesRequired || 0),
      badges: sponsorBadges,
    },
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.analystData.numberBadgesRequired || 0),
      badges: analystBadges,
    },
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.reviewerData.numberBadgesRequired || 0),
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
    watch,
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
        // console.log("event from transactor", event);
        // console.log("receipt", receipt);
        // console.log("args", event?.args["uri"]);
        const newLaborMarketAddress = event?.args["marketAddress"];
        const body = JSON.stringify({
          eventFilter: "LaborMarketConfigured",
          address: newLaborMarketAddress,
          blockNumber: receipt.blockNumber,
          transactionHash: receipt.transactionHash,
        });
        console.log("body", body);
        fetch("/api/index-event", {
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
        }).then((res) => {
          console.log("res", res);
          res.json().then((r) => console.log("r", r));
          navigate(`/app/market/${newLaborMarketAddress}`);
        });
      },
      [contracts.LaborMarketFactory.address, navigate]
    ),
  });

  const onSubmit = (data: finalMarketData) => {
    // write to contract with values
    transactor.start({
      metadata: data.marketplaceData,
      config: ({ account, cid }) => configureFromValues(contracts, { owner: account, cid, values: data }),
    });
  };

  const onGoBack = () => {
    navigate(`/app/market/new/reviewer-permissions`);
  };

  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  const sponsorGatingType = watch("sponsorData.gatingType");
  const analystGatingType = watch("analystData.gatingType");
  const reviewerGatingType = watch("reviewerData.gatingType");

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
                      defaultValue={contracts.BucketEnforcement.address}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[{ label: "Constant Likert", value: contracts.BucketEnforcement.address }]}
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
                {sponsorGatingType === ("Any" || "All") && (
                  <Field>
                    <Controller
                      name="sponsorData.numberBadgesRequired"
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Input onChange={onChange} value={value} onBlur={onBlur} ref={ref} type="number" min={1} />
                      )}
                    />
                    <Error error={errors.sponsorData?.numberBadgesRequired?.message} />
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
                {analystGatingType === ("Any" || "All") && (
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
                {reviewerGatingType === ("Any" || "All") && (
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
              <FormProgress percent={100} onGoBack={onGoBack} cancelLink={"/analyze"} submitLabel="CreateMarketplace" />
            </form>
          </main>
        </div>
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
