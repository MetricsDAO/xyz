import { useEffect, useState } from "react";
import type { Chain } from "wagmi";
import { useContract, useNetwork, useProvider } from "wagmi";
import * as PolygonxMetricJson from "core-evm-contracts/deployments/polygon/Xmetric.json";
import * as PolygonQuestionAPIJson from "core-evm-contracts/deployments/polygon/QuestionAPI.json";
import * as PolygonQuestionStateControllerJson from "core-evm-contracts/deployments/polygon/QuestionStateController.json";
import * as PolygonBountyQuestionJson from "core-evm-contracts/deployments/polygon/BountyQuestion.json";
import * as PolygonCostControllerJson from "core-evm-contracts/deployments/polygon/ActionCostController.json";
import * as PolygonVaultJson from "core-evm-contracts/deployments/polygon/Vault.json";
import invariant from "invariant";

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

  // if (chainId === 137) {
  // Polygon
  xMetricJson = PolygonxMetricJson;
  questionAPIJson = PolygonQuestionAPIJson;
  questionStateController = PolygonQuestionStateControllerJson;
  bountyQuestionJson = PolygonBountyQuestionJson;
  costController = PolygonCostControllerJson;
  vaultJson = PolygonVaultJson;

  // More chains to come?...

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
  invariant(bountyQuestionJson, "BountyQuestion contract not found");
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
  invariant(questionStateController, "QuestionStateController contract not found");
  const contract = useContract({
    addressOrName: questionStateController.address,
    contractInterface: questionStateController.abi,
    signerOrProvider: provider,
  });
  return contract;
}
