import { useNavigate } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketFactoryInterface__factory, LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import type { MarketplaceFormState } from "~/routes/app+/market_.new";
import { postNewEvent } from "~/utils/fetch";
import { OverviewForm } from "./overview-form";
import type { MarketplaceForm } from "./schema";
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
      />
      <OverviewForm defaultValues={defaultValues} onPrevious={onPrevious} onSubmit={onSubmit} />
    </>
  );
}

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
