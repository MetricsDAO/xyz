import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { providers } from "ethers";
import BountyQuestionService from "./contracts/bounty-question-service.server";
import type { Contracts } from "./contracts.server";
import { getContracts } from "./contracts.server";
import QuestionStateControllerService from "./contracts/question-state-controller-service.server";
import QuestionService from "./question-service.server";

type Services = {
  bountyQuestion: BountyQuestionService;
  questions: QuestionService;
  contracts: Contracts;
};

const contracts = getContracts();

function withServices<T>(data: DataFunctionArgs, fn: (services: Services) => Promise<T>) {
  const ethersProvider = providers.getDefaultProvider(process.env.NETWORK === "polygon" ? "matic" : undefined);
  const bountyQuestionService = new BountyQuestionService(ethersProvider);
  const questionStateControllerService = new QuestionStateControllerService(ethersProvider);
  const questions = new QuestionService(bountyQuestionService, questionStateControllerService);
  return fn({
    bountyQuestion: bountyQuestionService,
    questions,
    contracts,
  });
}

export { withServices };
