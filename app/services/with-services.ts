import type { DataFunctionArgs } from "@remix-run/server-runtime";
import BountyQuestionService from "./bounty-question-service.server";
import type { Contracts } from "./contracts.server";
import { getEthersContracts, getContracts } from "./contracts.server";

type Services = {
  bountyQuestion: BountyQuestionService;
  contracts: Contracts;
};

const contracts = getContracts();
const ethersContracts = getEthersContracts(contracts);

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const bountyQuestionService = new BountyQuestionService(ethersContracts.bountyQuestionContract);
  return fn({
    bountyQuestion: bountyQuestionService,
    contracts,
  });
}

export { withServices };
