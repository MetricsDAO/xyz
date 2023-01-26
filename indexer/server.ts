import type { LaborMarketNetwork, LaborMarket } from "labor-markets-abi";
import { logger } from "~/services/logger.server";
import { Pinekit } from "pinekit";
import env from "~/env";
import type { ExtractAbiEventNames } from "abitype";
import { documentLaborMarket, indexLaborMarket } from "~/services/labor-market.server";

type EventName =
  | ExtractAbiEventNames<typeof LaborMarketNetwork["abi"]>
  | ExtractAbiEventNames<typeof LaborMarket["abi"]>;

const pine = new Pinekit({ apiKey: env.PINE_API_KEY });
const subscrber = pine.subscriber("bryan-125", { namespace: "mdao-dev", version: "0.0.1" });

async function run() {
  const events = pine.streamEvents(subscrber, { limit: 10 });
  for await (const event of events) {
    logger.info(`indexer: event ${event.decoded.name} at ${event.txHash}`, { event });
    try {
      switch (event.decoded.name as EventName) {
        case "LaborMarketConfigured":
          await documentLaborMarket({ address: event.contract.address, block: event.block.number }).then(
            indexLaborMarket
          );
        // case "RequestCreated":
        //   await indexRequestCreated(event);
        // case "RequestFulfilled":
        //   await indexRequestFulfilled(event);
      }
    } catch (error) {
      const err = error as Error;
      logger.error(`indexer: failed to index event ${event.decoded.name} at ${event.txHash}, skipping`, {
        error: err.message,
      });
    }
    await pine.saveCursorAt(event, subscrber);
  }
}

run()
  .catch((err) => logger.error(err.message))
  .finally(() => process.exit(1));
