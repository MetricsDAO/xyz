import { ethers, providers } from "ethers";
import type { ContractContext } from "~/types/generated/BountyQuestion";

export type Contracts = ReturnType<typeof getContracts>;

export function getContracts() {
  let xMetricJson = require(`contracts/Xmetric.json`);
  let questionAPIJson = require(`contracts/QuestionAPI.json`);
  let questionStateController = require(`contracts/QuestionStateController.json`);
  let bountyQuestionJson = require(`contracts/BountyQuestion.json`);
  let costController = require(`contracts/ActionCostController.json`);
  let vaultJson = require(`contracts/Vault.json`);

  const bountyQuestionContract = new ethers.Contract(
    bountyQuestionJson.address,
    bountyQuestionJson.abi,
    providers.getDefaultProvider(process.env.NETWORK === "polygon" ? "matic" : undefined)
  ) as unknown as ContractContext;

  return {
    xMetricJson,
    questionAPIJson,
    questionStateController,
    bountyQuestionJson,
    costController,
    vaultJson,
    bountyQuestionContract,
  };
}
