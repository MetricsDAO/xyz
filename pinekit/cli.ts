import { Command } from "commander";
import { testAddresses } from "contracts/test-addresses";
import { LaborMarket, LaborMarketNetwork } from "labor-markets-abi";
import { Pinekit } from "pinekit";
import env from "~/env.server";

require("dotenv").config();

const program = new Command();

program.name("pine-cli").description("CLI for interacting with Pine");

const pine = new Pinekit({ apiKey: env.PINE_API_KEY });

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
      version: "0.0.1",
      blockchain: {
        name: "polygon",
        network: "mainnet",
      },
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
    console.log(tracers);
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

program.parse();
