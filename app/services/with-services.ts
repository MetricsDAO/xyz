import type { DataFunctionArgs } from "@remix-run/server-runtime";
import BountyQuestionService from "./bounty-question-service.server";
import { getContracts } from "./contracts.server";

type Services = {
  bountyQuestion: BountyQuestionService;
};

const contracts = getContracts();

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const bountyQuestionService = new BountyQuestionService(contracts.bountyQuestionContract);
  return fn({
    bountyQuestion: bountyQuestionService,
  });
}

export { withServices };
