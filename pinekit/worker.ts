import type { TracerConfig, TracerContract, TracerEvent } from "./types";
import type { Abi, ExtractAbiEventNames } from "abitype";
import type { Client } from "./client";

interface WorkerOpts {
  tracer: Omit<TracerConfig, "contracts">;
  subscriber: string;
  client: Client;
  /** Optional logger to use for logging events and errors. */
  logger?: Pick<typeof console, "info" | "error">;
}

interface WorkerContract<T extends Abi = Abi> extends TracerContract {
  name: string;
  addresses: string[];
  schema: T;
}

interface WorkerEventFn {
  (event: TracerEvent): unknown;
}

export function createWorker({ tracer, client, subscriber, logger = console }: WorkerOpts) {
  /** Event handler registry */
  const handlerRegistry = new Map<string, Set<WorkerEventFn>>();

  /** Contract registry. */
  const contractRegistry = new Map<string, WorkerContract>();

  /**
   * Registers a contract for the tracer that can be used to subscribe to events.
   */
  function contract<T extends Abi>(name: string, opts: { schema: T; addresses: string[] }) {
    const newContract = { name, ...opts };
    contractRegistry.set(name, newContract);
    return newContract;
  }

  /**
   * Creates a contract handle that listens to contracts created from a factory contract.
   */
  function contractFromEvent<TAbi extends Abi, TContract extends WorkerContract>(
    name: string,
    opts: { contract: TContract; event: ExtractAbiEventNames<TContract["schema"]>; arg: string; schema: TAbi }
  ) {
    const address = `${opts.event}.${opts.arg}@${opts.contract.name}`;
    const newContract = { name, addresses: [address], schema: opts.schema };
    contractRegistry.set(name, newContract);
    return newContract;
  }

  // Hack to do a "fromBlock" type functionality until Pine supports it.
  const FROM_BLOCK = 40607827;
  /**
   * Registers an event handler for a contract event
   *
   * @example
   * ```ts
   * onEvent(LaborMarket, "LaborMarketConfigured", ({ contract, event }) => {
   *  console.log(contract, event);
   * });
   */
  function onEvent<TContract extends WorkerContract, TEventName extends ExtractAbiEventNames<TContract["schema"]>>(
    contract: TContract,
    event: TEventName,
    fn: WorkerEventFn
  ) {
    const key = `${contract.name}.${event}`;
    const handlers = handlerRegistry.get(key) || new Set();
    handlers.add((event) => {
      if (event.block.number <= FROM_BLOCK) {
        logger.info(`Event happened before FROM_BLOCK ${FROM_BLOCK}. Skipping`);
      } else {
        fn(event);
      }
    });
    handlerRegistry.set(key, handlers);
  }

  /**
   * Starts the worker. This will block until the process is terminated.
   */
  async function run() {
    const tracerHandle = client.tracer(tracer);

    // Find or create the tracer.
    try {
      await client.getTracerDetails(tracerHandle);
    } catch {
      logger.info(`tracer not found, creating...`, tracerHandle);
      await client.createTracer({ contracts: Array.from(contractRegistry.values()), ...tracer });
      await client.startTracer(tracerHandle);
    }

    const subHandle = client.subscriber(subscriber, tracerHandle);

    // Loop through events and process them with the registered handlers, if any.
    logger.info(`subscribing to events...`, subHandle);
    for await (const event of client.streamEvents(subHandle, { limit: 10 })) {
      const key = `${event.contract.name}.${event.decoded.name}`;
      const handlers = handlerRegistry.get(key);
      if (!handlers) {
        logger.info(`no handlers for event ${key}`, event);
      } else {
        for (const handler of handlers) {
          logger.info(`processing event ${key}`, event);
          await handler(event);
        }
      }
      await client.saveCursorAt(event, subHandle);
    }
  }

  return { contract, contractFromEvent, onEvent, run };
}
