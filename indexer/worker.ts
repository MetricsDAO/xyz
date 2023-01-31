import { LaborMarketNetwork as LaborMarketNetworkAbi, LaborMarket as LaborMarketAbi } from "labor-markets-abi";
import envServer from "~/env.server";
import { indexLaborMarket } from "~/services/labor-market.server";
import { logger } from "~/services/logger.server";
import * as pine from "pinekit";

const worker = pine.createWorker({
  client: new pine.Client({ apiKey: envServer.PINE_API_KEY }),
  subscriber: envServer.PINE_SUBSCRIBER,
  logger: logger,
  tracer: {
    namespace: envServer.PINE_NAMESPACE,
    version: "1.4.2-2",
    blockchain: { name: "polygon", network: "mainnet" },
  },
});

const LaborMarketNetwork = worker.contract("LaborMarketNetwork", {
  addresses: [LaborMarketNetworkAbi.address],
  schema: LaborMarketNetworkAbi.abi,
});

const LaborMarket = worker.contractFromEvent("LaborMarket", {
  contract: LaborMarketNetwork,
  event: "LaborMarketCreated",
  arg: "marketAddress",
  schema: LaborMarketAbi.abi,
});

worker.onEvent(LaborMarket, "LaborMarketConfigured", async (event) => {
  return indexLaborMarket(event);
});

worker.run();