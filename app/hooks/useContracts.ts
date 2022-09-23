import { useEffect, useState } from "react";
import type { Chain } from "wagmi";
import { useContract, useNetwork, useProvider } from "wagmi";

export function useContracts({ chainId }: { chainId?: Chain["id"] }) {
  const [
    { xMetricJson, questionAPIJson, questionStateController, bountyQuestionJson, costController, vaultJson },
    setContracts,
  ] = useState(getContracts(chainId));

  useEffect(() => {
    setContracts(getContracts(chainId));
  }, [chainId]);

  return {
    xMetricJson,
    questionAPIJson,
    questionStateController,
    bountyQuestionJson,
    costController,
    vaultJson,
  };
}

function getContracts(chainId?: Chain["id"]) {
  let xMetricJson;
  let questionAPIJson;
  let questionStateController;
  let bountyQuestionJson;
  let costController;
  let vaultJson;

  if (chainId === 137 || !chainId) {
    xMetricJson = require(`core-evm-contracts/deployments/polygon/Xmetric.json`);
    questionAPIJson = require(`core-evm-contracts/deployments/polygon/QuestionAPI.json`);
    questionStateController = require(`core-evm-contracts/deployments/polygon/QuestionStateController.json`);
    bountyQuestionJson = require(`core-evm-contracts/deployments/polygon/BountyQuestion.json`);
    costController = require(`core-evm-contracts/deployments/polygon/ActionCostController.json`);
    vaultJson = require(`core-evm-contracts/deployments/polygon/Vault.json`);
  }
  // // TODO: What is going on with the other chains?? Missing contracts?
  // if (chainId === 3) {
  //   xMetricJson = require(`core-evm-contracts/deployments/ropsten/Xmetric.json`);
  //   questionAPIJson = require(`core-evm-contracts/deployments/ropsten/QuestionAPI.json`);
  //   questionStateController = require(`core-evm-contracts/deployments/ropsten/QuestionStateController.json`);
  //   bountyQuestionJson = require(`core-evm-contracts/deployments/ropsten/BountyQuestion.json`);
  //   costController = require(`core-evm-contracts/deployments/ropsten/ActionCostController.json`);
  //   vaultJson = require(`core-evm-contracts/deployments/ropsten/Vault.json`);
  // }
  //   else {
  //     //localhost
  //     xMetricJson = require(`core-evm-contracts/deployments/localhost/Xmetric.json`);
  //     questionAPIJson = require(`core-evm-contracts/deployments/localhost/QuestionAPI.json`);
  //     questionStateController = require(`core-evm-contracts/deployments/localhost/QuestionStateController.json`);
  //     bountyQuestionJson = require(`core-evm-contracts/deployments/localhost/BountyQuestion.json`);
  //     costController = require(`core-evm-contracts/deployments/localhost/ActionCostController.json`);
  //     vaultJson = require(`core-evm-contracts/deployments/localhost/Vault.json`);
  //   }

  return {
    xMetricJson,
    questionAPIJson,
    questionStateController,
    bountyQuestionJson,
    costController,
    vaultJson,
  };
}

export function useBountyQuestionContract() {
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });
  const { bountyQuestionJson } = useContracts({ chainId: chain?.id });
  const contract = useContract({
    addressOrName: bountyQuestionJson.address,
    contractInterface: bountyQuestionJson.abi,
    signerOrProvider: provider,
  });
  return contract;
}

export function useQuestionStateControllerContract() {
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });
  const { questionStateController } = useContracts({ chainId: chain?.id });
  const contract = useContract({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
    signerOrProvider: provider,
  });
  return contract;
}
