import * as PolygonCostControllerJson from "core-evm-contracts/deployments/polygon/ActionCostController.json";
import * as PolygonBountyQuestionJson from "core-evm-contracts/deployments/polygon/BountyQuestion.json";
import * as PolygonQuestionAPIJson from "core-evm-contracts/deployments/polygon/QuestionAPI.json";
import * as PolygonQuestionStateControllerJson from "core-evm-contracts/deployments/polygon/QuestionStateController.json";
import * as PolygonVaultJson from "core-evm-contracts/deployments/polygon/Vault.json";
import * as PolygonxMetricJson from "core-evm-contracts/deployments/polygon/Xmetric.json";
import { useMemo } from "react";
import type { Chain } from "wagmi";

export function useContracts({ chainId }: { chainId?: Chain["id"] }) {
  const { xMetricJson, questionAPIJson, questionStateController, bountyQuestionJson, costController, vaultJson } =
    useMemo(() => {
      return getContracts(chainId);
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
