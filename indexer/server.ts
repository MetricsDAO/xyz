import type { TracerEvent } from "@flipsidecrypto/pine-sdk";
import { tracer as createTracer } from "@flipsidecrypto/pine-sdk";
import type { LaborMarketNetwork, LaborMarket } from "labor-markets-abi";
import env from "~/env";
import { indexLaborMarket } from "~/services/indexing.server";
import { logger } from "~/services/logger.server";

const tracer = createTracer({
  connection: {
    apikey: env.PINE_API_KEY,
    endpoint: "https://pine.lab3547.xyz",
  },
  tracer: {
    namespace: "mdao-dev",
    version: "0.0.1",
  },
});

// Union of all possible event names across all contracts.
type EventName =
  | Extract<typeof LaborMarketNetwork["abi"][number], { type: "event" }>["name"]
  | Extract<typeof LaborMarket["abi"][number], { type: "event" }>["name"];

async function processEvent(event: TracerEvent) {
  try {
    switch (event.decoded.name as EventName) {
      case "LaborMarketConfigured":
        await indexLaborMarket(event.contract.address);
        break;
    }
  } catch (error) {
    logger.error("indexer: processEvent", { event, error });
  }
}

async function main() {
  await tracer.start();
  await tracer.consume(
    async function (response) {
      if (response.error) {
        logger.error("indexer", response.error);
        return false;
      }

      if (!response.data) {
        logger.info("indexer: no events");
        return false;
      }

      for (const event of response.data) {
        logger.info(`indexer: event: ${event.decoded.name}`, event);
        await processEvent(event);
      }
      return true;
    },
    { name: "bryan-112", batchSize: 10 }
  );
}

main().finally(() => process.exit(1));
