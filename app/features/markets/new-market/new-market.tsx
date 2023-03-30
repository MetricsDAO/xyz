import { useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import type { DefaultValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MarketNewValues } from "./schema";
import { MarketNewValuesSchema } from "./schema";
import { BigNumber, ethers } from "ethers";
import { LaborMarketNetwork__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { Button } from "~/components/button";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { Combobox, Container, Error, Field, Input, Label, Select, Textarea } from "~/components";
import { REPUTATION_REWARD_POOL, REPUTATION_REVIEW_SIGNAL_STAKE, REPUTATION_TOKEN_ID } from "~/utils/constants";
import type { Project, Token } from "@prisma/client";
import { useContracts } from "~/hooks/use-root-data";

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
  inputs: { owner: EvmAddress; cid: string; values: MarketNewValues }
) {
  const { owner, cid, values } = inputs;
  return configureWrite({
    abi: contracts.LaborMarketNetwork.abi,
    address: contracts.LaborMarketNetwork.address,
    functionName: "createLaborMarket",
    args: [
      contracts.LaborMarket.address,
      {
        marketUri: cid,
        owner: owner,
        modules: {
          network: contracts.LaborMarketNetwork.address,
          reputation: contracts.ReputationModule.address,
          enforcement: contracts.ScalableLikertEnforcement.address,
          enforcementKey: ethers.utils.formatBytes32String("aggressive") as `0x${string}`,
        },
        delegateBadge: {
          token: values.configuration.delegateBadge.token,
          tokenId: BigNumber.from(values.configuration.delegateBadge.tokenId),
        },
        maintainerBadge: {
          token: values.configuration.maintainerBadge.token,
          tokenId: BigNumber.from(values.configuration.maintainerBadge.tokenId),
        },
        reputationBadge: {
          token: contracts.ReputationToken.address,
          tokenId: BigNumber.from(REPUTATION_TOKEN_ID),
        },
        reputationParams: {
          rewardPool: BigNumber.from(REPUTATION_REWARD_POOL),
          reviewStake: BigNumber.from(REPUTATION_REVIEW_SIGNAL_STAKE),
          provideStake: BigNumber.from(values.configuration.reputationParams.submitMin),
          submitMin: BigNumber.from(values.configuration.reputationParams.submitMin),
          submitMax: BigNumber.from(values.configuration.reputationParams.submitMax ?? ethers.constants.MaxUint256),
        },
      },
    ],
  });
}

export function NewMarket({
  tokens,
  projects,
  defaultValues,
}: {
  tokens: Token[];
  projects: Project[];
  defaultValues: DefaultValues<MarketNewValues>;
}) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<MarketNewValues>({
    resolver: zodResolver(MarketNewValuesSchema),
    defaultValues: {
      configuration: {
        modules: {
          network: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
          enforcementKey: "aggressive",
          reputation: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
        },
        reputationBadge: {
          token: "0x854DE1bf96dFBe69FC46f1a888d26934Ad47B77f",
          tokenId: "4",
        },
        reputationParams: {
          rewardPool: 100,
          provideStake: 100,
          reviewStake: 100,
        },
      },
      ...defaultValues,
    },
  });

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketNetwork__factory.createInterface();
        const event = getEventFromLogs(contracts.LaborMarketNetwork.address, iface, receipt.logs, "LaborMarketCreated");
        if (event) navigate(`/app/market/${event.args["marketAddress"]}`);
      },
      [contracts.LaborMarketNetwork.address, navigate]
    ),
  });

  const onSubmit = (values: MarketNewValues) => {
    transactor.start({
      metadata: values.appData,
      config: ({ account, cid }) => configureFromValues(contracts, { owner: account, cid, values }),
    });
  };

  // Filtering out MBETA for now. Might not be necessary later on.
  const tokenAllowlist = tokens.filter((t) => t.symbol !== "MBETA").map((t) => ({ label: t.name, value: t.symbol }));

  return (
    <Container className="py-16">
      <TxModal
        transactor={transactor}
        title="Create Marketplace"
        confirmationMessage="Confirm that you would like to create a new marketplace."
      />

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
          <input type="hidden" {...register("appData.type", { value: "analyze" })} />

          <Field>
            <Label size="lg">Challenge Marketplace Title*</Label>
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
                        // { label: "Anyone", value: "anyone" }, // Not for MVP
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
                  name="appData.tokenAllowlist"
                  render={({ field }) => <Combobox {...field} options={tokenAllowlist} />}
                />
                <Error error={errors.appData?.tokenAllowlist?.message} />
              </Field>
              <Field>
                <Label>Reward Curve</Label>
                <Controller
                  control={control}
                  name="configuration.modules.enforcement"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[{ label: "Constant Likert", value: contracts.ScalableLikertEnforcement.address }]}
                    />
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

          <Button size="lg" type="submit">
            Next
          </Button>
        </form>
      </div>
    </Container>
  );
}
