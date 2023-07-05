import { useNavigate } from "@remix-run/react";
import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketFactoryInterface__factory, LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import type { MarketplaceFormState } from "~/routes/app+/market_.new";
import { postNewEvent } from "~/utils/fetch";
import { getEventFromLogs } from "~/utils/helpers";
import { OverviewForm } from "./overview-form";
import type { MarketplaceForm } from "./schema";
import { getRewardCurveArgs } from "./reward-curve-constants";
import { LaborMarketAppDataSchema } from "~/domain/labor-market/schemas";

export function LaborMarketCreator({
  defaultValues,
  onPrevious,
}: {
  defaultValues: MarketplaceFormState;
  onPrevious: () => void;
}) {
  const contracts = useContracts();
  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketFactoryInterface__factory.createInterface();
        const event = getEventFromLogs(contracts.LaborMarketFactory.address, iface, receipt.logs, "LaborMarketCreated");
        const newLaborMarketAddress = event?.args["marketAddress"];
        postNewEvent({
          name: "LaborMarketConfigured",
          address: newLaborMarketAddress,
          blockNumber: receipt.blockNumber,
          transactionHash: receipt.transactionHash,
        }).then(() => navigate(`/app/market/${newLaborMarketAddress}`));
      },
      [contracts.LaborMarketFactory.address, navigate]
    ),
  });

  const onSubmit = (data: MarketplaceForm) => {
    const metadata = LaborMarketAppDataSchema.parse({
      ...data.appData,
      prerequisites: {
        sponsor: data.sponsor,
        analyst: data.analyst,
        reviewer: data.reviewer,
      },
    });
    // write to contract with values
    transactor.start({
      metadata: metadata,
      config: ({ account, cid }) => configureFromValues(contracts, { owner: account, cid, values: data }),
    });
  };

  return (
    <>
      <TxModal
        transactor={transactor}
        title="Create Marketplace"
        confirmationMessage="Confirm that you would like to create a new marketplace."
        redirectStep={true}
      />
      <OverviewForm defaultValues={defaultValues} onPrevious={onPrevious} onSubmit={onSubmit} />
    </>
  );
}

function configureFromValues(
  contracts: ReturnType<typeof useContracts>,
  inputs: { owner: EvmAddress; cid: string; values: MarketplaceForm }
) {
  const { owner, cid } = inputs;

  const enforcement = inputs.values.appData.enforcement;

  const curveProperties = getRewardCurveArgs(enforcement);

  const enforcementAddress = contracts.BucketEnforcement.address;

  const sigs: EvmAddress[] = [
    LaborMarket__factory.createInterface().getSighash(
      "submitRequest(uint8,tuple(uint48,uint48,uint48,uint64,uint64,uint256,uint256,address,address),string)"
    ) as EvmAddress,
    LaborMarket__factory.createInterface().getSighash("signal(uint256)") as EvmAddress,
    LaborMarket__factory.createInterface().getSighash("signalReview(uint256,uint24)") as EvmAddress,
  ];

  const sponsorBadges = inputs.values.sponsor.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: badge.maxBadgeBalance != undefined ? BigNumber.from(badge.maxBadgeBalance) : ethers.constants.MaxUint256,
      points: BigNumber.from(1),
    };
  });

  const analystBadges = inputs.values.analyst.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: badge.maxBadgeBalance != undefined ? BigNumber.from(badge.maxBadgeBalance) : ethers.constants.MaxUint256,
      points: BigNumber.from(1),
    };
  });

  const reviewerBadges = inputs.values.reviewer.badges.map((badge) => {
    return {
      badge: badge.contractAddress,
      id: BigNumber.from(badge.tokenId),
      min: BigNumber.from(badge.minBadgeBalance),
      max: badge.maxBadgeBalance != undefined ? BigNumber.from(badge.maxBadgeBalance) : ethers.constants.MaxUint256,
      points: BigNumber.from(1),
    };
  });

  const nodes = [
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.sponsor.numberBadgesRequired || 1),
      badges: sponsorBadges,
    },
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.analyst.numberBadgesRequired || 1),
      badges: analystBadges,
    },
    {
      deployerAllowed: true,
      required: BigNumber.from(inputs.values.reviewer.numberBadgesRequired || 1),
      badges: reviewerBadges,
    },
  ];

  return configureWrite({
    abi: contracts.LaborMarketFactory.abi,
    address: contracts.LaborMarketFactory.address,
    functionName: "createLaborMarket",
    args: [
      owner,
      cid,
      enforcementAddress,
      curveProperties.auxilaries,
      curveProperties.alphas,
      curveProperties.betas,
      sigs,
      nodes,
    ],
  });
}
