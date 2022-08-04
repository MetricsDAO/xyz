
export function getContracts() {
    let xMetricJson;
    let questionAPIJson;
    let questionStateController;
    let bountyQuestionJson;
    let costController;
    let vaultJson;


if (process.env.NETWORK === "ropsten") {
    xMetricJson = require(`core-evm-contracts/deployments/ropsten/Xmetric.json`);
    questionAPIJson = require(`core-evm-contracts/deployments/ropsten/QuestionAPI.json`);
    questionStateController = require(`core-evm-contracts/deployments/ropsten/QuestionStateController.json`);
    bountyQuestionJson = require(`core-evm-contracts/deployments/ropsten/BountyQuestion.json`);
    costController = require(`core-evm-contracts/deployments/ropsten/ActionCostController.json`);
    vaultJson = require(`core-evm-contracts/deployments/ropsten/Vault.json`);
    } else if (process.env.NETWORK === "polygon") {
        xMetricJson = require(`core-evm-contracts/deployments/polygon/Xmetric.json`);
        questionAPIJson = require(`core-evm-contracts/deployments/polygon/QuestionAPI.json`);
        questionStateController = require(`core-evm-contracts/deployments/polygon/QuestionStateController.json`);
        bountyQuestionJson = require(`core-evm-contracts/deployments/polygon/BountyQuestion.json`);
        costController = require(`core-evm-contracts/deployments/polygon/ActionCostController.json`);
        vaultJson = require(`core-evm-contracts/deployments/polygon/Vault.json`);
    } else { //localhost
        xMetricJson = require(`core-evm-contracts/deployments/localhost/Xmetric.json`);
        questionAPIJson = require(`core-evm-contracts/deployments/localhost/QuestionAPI.json`);
        questionStateController = require(`core-evm-contracts/deployments/localhost/QuestionStateController.json`);
        bountyQuestionJson = require(`core-evm-contracts/deployments/localhost/BountyQuestion.json`);
        costController = require(`core-evm-contracts/deployments/localhost/ActionCostController.json`);
        vaultJson = require(`core-evm-contracts/deployments/localhost/Vault.json`);
    }

    return {
        xMetricJson,
        questionAPIJson,
        questionStateController,
        bountyQuestionJson,
        costController,
        vaultJson
    }
}