import { ethers, logger } from "ethers";
import { LaborMarketMetaSchema, LaborMarketSchema } from "~/domain";
import { upsertLaborMarket } from "../app/services/labor-market.server";
import env from "~/env";
import type { TracerEvent } from "pinekit/types";
import type {
  LaborMarketConfiguredEventObject,
  RequestCreatedEventObject,
  RequestFulfilledEventObject,
} from "~/contracts/LaborMarket";
import { inputsToObject, parseFromIpfs } from "./utils";
import { LaborMarket__factory } from "~/contracts";

// RPC provider used be all the contract reads in this file
const provider = new ethers.providers.JsonRpcProvider(env.QUICKNODE_URL);

export async function indexLaborMarketConfigured(event: TracerEvent) {
  // const inputs = inputsToObject<LaborMarketConfiguredEventObject>(event.decoded.inputs);
  const contract = LaborMarket__factory.connect(event.contract.address, provider);
  const config = await contract.configuration({ blockTag: event.block.number });
  const owner = await contract.owner({ blockTag: event.block.number });
  const ipfsData = await parseFromIpfs(LaborMarketMetaSchema, config.marketUri);
  const laborMarket = LaborMarketSchema.parse({
    address: event.contract.address,
    sponsorAddress: owner,
    submitRepMin: config.reputationConfig.submitMin.toNumber(),
    submitRepMax: config.reputationConfig.submitMax.toNumber(),
    reviewBadgerAddress: config.maintainerBadge,
    reviewBadgerTokenId: config.maintainerTokenId.toHexString(),
    title: ipfsData.title,
    description: ipfsData.description,
    type: ipfsData.type,
    projectIds: ipfsData.projectIds,
    rewardCurveAddress: config.paymentModule,
    launch: {
      access: "delegates",
      badgerAddress: config.delegateBadge,
      badgerTokenId: config.delegateTokenId.toHexString(),
    },
  });
  const lm = await upsertLaborMarket(laborMarket);
  logger.info(`indexer: indexed labor market ${lm.address}`);
}

export async function indexRequestCreated(event: TracerEvent) {
  const inputs = inputsToObject<RequestCreatedEventObject>(event.decoded.inputs);
}

export async function indexRequestFulfilled(event: TracerEvent) {
  const inputs = inputsToObject<RequestFulfilledEventObject>(event.decoded.inputs);
}
