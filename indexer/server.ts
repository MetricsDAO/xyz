import type { LaborMarketNetwork, LaborMarket } from "labor-markets-abi";
import { logger } from "~/services/logger.server";
import { Pinekit } from "pinekit";
import env from "~/env.server";
import type { ExtractAbiEventNames } from "abitype";
import { documentLaborMarket, indexLaborMarket } from "~/services/labor-market.server";
import { documentServiceRequest, upsertServiceRequest } from "~/services/service-request.server";

type EventName =
  | ExtractAbiEventNames<typeof LaborMarketNetwork["abi"]>
  | ExtractAbiEventNames<typeof LaborMarket["abi"]>;

const pine = new Pinekit({ apiKey: env.PINE_API_KEY });
const subscrber = pine.subscriber(env.PINE_SUBSCRIBER, { namespace: env.PINE_NAMESPACE, version: "0.0.1" });

async function run() {
  const events = pine.streamEvents(subscrber, { limit: 10 });
  for await (const event of events) {
    logger.info(`indexer: event ${event.decoded.name} at ${event.txHash}`, { event });
    try {
      switch (event.decoded.name as EventName) {
        case "LaborMarketConfigured":
          await documentLaborMarket(event).then(indexLaborMarket);
        case "RequestCreated":
          await documentServiceRequest(event).then(upsertServiceRequest);
      }
      await pine.saveCursorAt(event, subscrber);
    } catch (error) {
      const err = error as Error;
      logger.error(`indexer: failed to index event ${event.decoded.name} at ${event.txHash}, skipping`, {
        error: err.message,
      });
    }
  }
}

run()
  .catch((err) => logger.error(err.message))
  .finally(() => process.exit(1));
