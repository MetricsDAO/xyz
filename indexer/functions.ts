import { ethers } from "ethers";
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

// RPC provider used be all the contract reads in this file
const provider = new ethers.providers.JsonRpcProvider(env.QUICKNODE_URL);

export async function indexLaborMarketConfigured(event: TracerEvent) {
  const inputs = inputsToObject<LaborMarketConfiguredEventObject>(event.decoded.inputs);
  const ipfsData = await parseFromIpfs(LaborMarketMetaSchema, inputs.configuration.marketUri);
  const laborMarket = LaborMarketSchema.parse({
    address: event.contract.address,
    submitRepMin: inputs.configuration.reputationConfig.submitMin,
    submitRepMax: inputs.configuration.reputationConfig.submitMin,
    reviewBadgerAddress: inputs.configuration.maintainerBadge,
    reviewBadgerTokenId: inputs.configuration.maintainerTokenId,
    title: ipfsData.title,
    description: ipfsData.description,
    type: ipfsData.type,
    projectIds: ipfsData.projectIds,
    rewardCurveAddress: inputs.configuration.paymentModule,
    launch: {
      access: "delegates",
      badgerAddress: inputs.configuration.delegateBadge,
      badgerTokenId: inputs.configuration.delegateTokenId,
    },
  });
  await upsertLaborMarket(laborMarket);
}

export async function indexRequestCreated(event: TracerEvent) {
  const inputs = inputsToObject<RequestCreatedEventObject>(event.decoded.inputs);
}

export async function indexRequestFulfilled(event: TracerEvent) {
  const inputs = inputsToObject<RequestFulfilledEventObject>(event.decoded.inputs);
}
