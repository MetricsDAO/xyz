import type { DataFunctionArgs } from "@remix-run/server-runtime";
import BountyQuestionContract from "./bounty-question-contract.server";
import { getContracts } from "./contracts.server";

type Services = {
  bountyQuestion: BountyQuestionContract;
};

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const contracts = getContracts();
  const bountyQuestionContract = new BountyQuestionContract(contracts);
  return fn({
    bountyQuestion: bountyQuestionContract,
  });
}

export { withServices };
