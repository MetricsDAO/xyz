import { Command } from "commander";
import { testAddresses } from "contracts/test-addresses";
import { LaborMarket, LaborMarketNetwork } from "labor-markets-abi";
import { Client } from "pinekit";
import env from "~/env.server";

require("dotenv").config();

const program = new Command();

program.name("pine-cli").description("CLI for interacting with Pine");

const pine = new Client({ apiKey: env.PINE_API_KEY });

program
  .command("create-tracer")
  .description("Create a new tracer")
  .option("-d, --dev", "Use development contracts", false)
  .action(async () => {
    const laborMarketNetworkAddress = program.opts().dev
      ? testAddresses.LaborMarketNetwork
      : LaborMarketNetwork.address;
    const res = await pine.createTracer({
      namespace: env.PINE_NAMESPACE,
      version: "2.0.0",
      blockchain: {
        name: "polygon",
        network: "mainnet",
      },
      fromBlock: 39064248,
      contracts: [
        { name: "LaborMarketNetwork", addresses: [laborMarketNetworkAddress], schema: LaborMarketNetwork.abi },
        {
          name: "LaborMarket",
          addresses: ["LaborMarketCreated.marketAddress@LaborMarketNetwork"],
          schema: LaborMarket.abi,
        },
      ],
    });
    console.log({ res });
  });

program
  .command("list-tracers")
  .description("List all tracers")
  .action(async () => {
    const tracers = await pine.listTracers();
    console.table(tracers.map((t) => ({ namespace: t.namespace, version: t.version, state: t.currentState.state })));
  });

program
  .command("start-tracer")
  .argument("<namespace>", "Namespace of the tracer")
  .argument("<version>", "Version of the tracer")
  .description("Start a tracer")
  .action(async (namespace, version) => {
    const res = await pine.startTracer({ namespace, version });
    console.log(res);
  });

program
  .command("tracer-details")
  .argument("<namespace>", "Namespace of the tracer")
  .argument("<version>", "Version of the tracer")
  .description("Get details of a tracer")
  .action(async (namespace, version) => {
    const res = await pine.getTracerDetails({ namespace, version });
    console.log(res.config.contracts);
  });

program
  .command("cancel-tracer")
  .argument("<namespace>", "Namespace of the tracer")
  .argument("<version>", "Version of the tracer")
  .description("Stop a tracer")
  .action(async (namespace, version) => {
    const res = await pine.cancelTracer({ namespace, version });
    console.log(res);
  });

program.parse();
