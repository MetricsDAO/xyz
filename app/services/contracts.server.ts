import { ethers, providers } from "ethers";
import type { ContractContext as BountyQuestionContractContext } from "~/types/generated/BountyQuestion";

export type Contracts = ReturnType<typeof getContracts>;

export function getContracts() {
  const xMetricJson = require(`contracts/Xmetric.json`);
  const questionAPIJson = require(`contracts/QuestionAPI.json`);
  const questionStateControllerJson = require(`contracts/QuestionStateController.json`);
  const bountyQuestionJson = require(`contracts/BountyQuestion.json`);
  const costControllerJson = require(`contracts/ActionCostController.json`);
  const vaultJson = require(`contracts/Vault.json`);

  return {
    xMetricJson,
    questionAPIJson,
    questionStateControllerJson,
    bountyQuestionJson,
    costControllerJson,
    vaultJson,
  };
}

export function getEthersContracts(contracts: Contracts) {
  const provider = providers.getDefaultProvider(process.env.NETWORK === "polygon" ? "matic" : undefined);

  const bountyQuestionContract = new ethers.Contract(
    contracts.bountyQuestionJson.address,
    contracts.bountyQuestionJson.abi,
    provider
  ) as unknown as BountyQuestionContractContext;

  return {
    bountyQuestionContract,
  };
}
