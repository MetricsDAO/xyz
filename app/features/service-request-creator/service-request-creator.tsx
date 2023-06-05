import type { Project, Token } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { claimDate, parseDatetime, unixTimestamp } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";
import { OverviewForm } from "./overview-form";
import type { ServiceRequestForm } from "./schema";

type SequenceState =
  | { state: "initial" }
  | { state: "approve-total-reward"; data: ServiceRequestForm } // in the case where reviewer and analyst token are the same
  | { state: "approve-analyst-reward"; data: ServiceRequestForm }
  | { state: "approve-reviewer-reward"; data: ServiceRequestForm }
  | { state: "create-service-request"; data: ServiceRequestForm };

interface ServiceRequestFormProps {
  projects: Project[];
  tokens: Token[];
  defaultValues?: DefaultValues<ServiceRequestForm>;
  laborMarketAddress: EvmAddress;
}

export function ServiceRequestCreator({
  defaultValues,
  laborMarketAddress,
  tokens,
  projects,
}: ServiceRequestFormProps) {
  const contracts = useContracts();
  const [sequence, setSequence] = useState<SequenceState>({ state: "initial" });

  const navigate = useNavigate();

  const approveAnalystRewardTransactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        if (sequence.state === "approve-analyst-reward") {
          setSequence({ state: "approve-reviewer-reward", data: sequence.data });
        } else if (sequence.state === "approve-total-reward") {
          setSequence({ state: "create-service-request", data: sequence.data });
        }
      },
      [sequence]
    ),
  });

  const approveReviewerRewardTransactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        if (sequence.state === "approve-reviewer-reward") {
          setSequence({ state: "create-service-request", data: sequence.data });
        }
      },
      [sequence]
    ),
  });

  const submitTransactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarket__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "RequestConfigured", laborMarketAddress);
        if (event) navigate(`/app/market/${laborMarketAddress}/request/${event.args[1]}`);
      },
      [laborMarketAddress, navigate]
    ),
  });

  useEffect(() => {
    if (sequence.state === "approve-total-reward") {
      const values = sequence.data;
      const analystReward = toTokenAmount(values.analyst.rewardPool, values.analyst.rewardTokenDecimals);
      const reviewerReward = toTokenAmount(values.reviewer.rewardPool, values.reviewer.rewardTokenDecimals);
      const approveAmount = analystReward.add(reviewerReward);
      approveAnalystRewardTransactor.start({
        config: () =>
          configureWrite({
            address: values.analyst.rewardToken,
            abi: ERC20_APPROVE_PARTIAL_ABI,
            functionName: "approve",
            args: [laborMarketAddress, approveAmount],
          }),
      });
    } else if (sequence.state === "approve-analyst-reward") {
      const values = sequence.data;
      approveAnalystRewardTransactor.start({
        config: () =>
          configureWrite({
            address: values.analyst.rewardToken,
            abi: ERC20_APPROVE_PARTIAL_ABI,
            functionName: "approve",
            args: [laborMarketAddress, toTokenAmount(values.analyst.rewardPool, values.analyst.rewardTokenDecimals)],
          }),
      });
    } else if (sequence.state === "approve-reviewer-reward") {
      const values = sequence.data;
      approveReviewerRewardTransactor.start({
        config: () =>
          configureWrite({
            address: values.reviewer.rewardToken,
            abi: ERC20_APPROVE_PARTIAL_ABI,
            functionName: "approve",
            args: [laborMarketAddress, toTokenAmount(values.reviewer.rewardPool, values.reviewer.rewardTokenDecimals)],
          }),
      });
    } else if (sequence.state === "create-service-request") {
      const values = sequence.data;
      submitTransactor.start({
        metadata: values.appData,
        config: ({ cid }) => configureFromValues({ contracts, inputs: { cid, form: values, laborMarketAddress } }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence]);

  const onSubmit = (values: ServiceRequestForm) => {
    if (values.analyst.rewardToken === values.reviewer.rewardToken) {
      setSequence({ state: "approve-total-reward", data: values });
    } else {
      setSequence({ state: "approve-analyst-reward", data: values });
    }
  };

  return (
    <>
      <TxModal
        transactor={approveAnalystRewardTransactor}
        title="Approve Analyst Reward"
        confirmationMessage={"Approve the app to transfer the tokens on your behalf"}
      />
      <TxModal
        transactor={approveReviewerRewardTransactor}
        title="Approve Reviewer Reward"
        confirmationMessage={"Approve the app to transfer the tokens on your behalf"}
      />
      <TxModal
        transactor={submitTransactor}
        title="Launch Challenge"
        confirmationMessage={"Confirm that you would like to launch this challenge and transfer the funds"}
      />

      <OverviewForm
        onSubmit={onSubmit}
        tokens={tokens}
        projects={projects}
        address={laborMarketAddress}
        defaultValues={defaultValues}
      />
    </>
  );
}

function configureFromValues({
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    cid: string;
    form: ServiceRequestForm;
    laborMarketAddress: EvmAddress;
  };
}) {
  const { form, cid, laborMarketAddress } = inputs;
  const currentDate = new Date();
  console.log(form.analyst);
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(form.analyst.endDate, form.analyst.endTime)));

  console.log("inputs", inputs);

  const obj = {
    pTokenProvider: form.analyst.rewardToken,
    pTokenProviderTotal: toTokenAmount(form.analyst.rewardPool, form.analyst.rewardTokenDecimals),
    pTokenReviewer: form.reviewer.rewardToken,
    pTokenReviewerTotal: toTokenAmount(form.reviewer.rewardPool, form.reviewer.rewardTokenDecimals),
    providerLimit: BigNumber.from(form.analyst.submitLimit),
    reviewerLimit: BigNumber.from(form.reviewer.reviewLimit),
    enforcementExp: unixTimestamp(new Date(parseDatetime(form.reviewer.reviewEndDate, form.reviewer.reviewEndTime))),
    signalExp: unixTimestamp(signalDeadline),
    submissionExp: unixTimestamp(new Date(parseDatetime(form.analyst.endDate, form.analyst.endTime))),
  };

  console.log("obj", obj);

  return configureWrite({
    abi: contracts.LaborMarket.abi,
    address: laborMarketAddress,
    functionName: "submitRequest",
    args: [
      0, // Ok to hardcode here. Nonce is used to prevent duplicate ids in multicall.
      obj,
      cid,
    ],
  });
}

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(
  iface: ethers.utils.Interface,
  logs: ethers.providers.Log[],
  eventName: string,
  laborMarketAddress: EvmAddress
) {
  const filtered = logs.filter((log) => log.address === laborMarketAddress);
  const mapped = filtered.map((log) => iface.parseLog(log));
  return mapped.find((e) => e.name === eventName);
}

const ERC20_APPROVE_PARTIAL_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
