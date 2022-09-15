import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { providers } from "ethers";
import BountyQuestionService from "./bounty-question-service.server";
import type { Contracts } from "./contracts.server";
import { getContracts } from "./contracts.server";

type Services = {
  bountyQuestion: BountyQuestionService;
  contracts: Contracts;
};

const contracts = getContracts();

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const ethersProvider = providers.getDefaultProvider(process.env.NETWORK === "polygon" ? "matic" : undefined);
  const bountyQuestionService = new BountyQuestionService(ethersProvider);
  return fn({
    bountyQuestion: bountyQuestionService,
    contracts,
  });
}

export { withServices };
