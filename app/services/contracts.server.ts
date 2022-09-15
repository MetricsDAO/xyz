import { ethers, providers } from "ethers";
import type { ContractContext as BountyQuestionContractContext } from "~/types/generated/BountyQuestion";
import xMetricJson from "contracts/Xmetric.json";
import bountyQuestionJson from "contracts/BountyQuestion.json";
import questionStateControllerJson from "contracts/QuestionStateController.json";
import questionAPIJson from "contracts/QuestionAPI.json";
import costControllerJson from "contracts/ActionCostController.json";
import vaultJson from "contracts/Vault.json";

export type Contracts = ReturnType<typeof getContracts>;

export function getContracts() {
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
