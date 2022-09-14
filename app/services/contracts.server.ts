import { ethers, providers } from "ethers";

export type Contracts = ReturnType<typeof getContracts>;

export function getContracts() {
  const network = process.env.NETWORK ?? "localhost";

  let xMetricJson = require(`core-evm-contracts/deployments/${network}/Xmetric.json`);
  let questionAPIJson = require(`core-evm-contracts/deployments/${network}/QuestionAPI.json`);
  let questionStateController = require(`core-evm-contracts/deployments/${network}/QuestionStateController.json`);
  let bountyQuestionJson = require(`core-evm-contracts/deployments/${network}/BountyQuestion.json`);
  let costController = require(`core-evm-contracts/deployments/${network}/ActionCostController.json`);
  let vaultJson = require(`core-evm-contracts/deployments/${network}/Vault.json`);

  const bountyQuestionContract = new ethers.Contract(
    bountyQuestionJson.address,
    bountyQuestionJson.abi,
    new providers.AnkrProvider("matic") //TODO: which provider?
  );

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
