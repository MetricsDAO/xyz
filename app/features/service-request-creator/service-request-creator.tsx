import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { claimDate, parseDatetime, unixTimestamp } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";
import type { ServiceRequestForm } from "./schema";
import { ServiceRequestFormSchema } from "./schema";
import { Step1Fields } from "./step1-fields";

interface ServiceRequestFormProps {
  projects: Project[];
  tokens: Token[];
  defaultValues?: DefaultValues<ServiceRequestForm>;
  laborMarketAddress: EvmAddress;
  page: number;
  header: boolean;
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

export function ServiceRequestCreator({
  projects,
  tokens,
  defaultValues,
  laborMarketAddress,
  page,
  header,
}: ServiceRequestFormProps) {
  const contracts = useContracts();
  const [values, setValues] = useState<ServiceRequestForm>();
  const [approved, setApproved] = useState(false);

  const navigate = useNavigate();

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

  const approveTransactor = useTransactor({
    onSuccess: useCallback((receipt) => {}, []),
  });

  useEffect(() => {
    if (values && approveTransactor.state === "success" && !approved) {
      setApproved(true);
      submitTransactor.start({
        metadata: values.appData,
        config: ({ cid }) => configureFromValues({ contracts, inputs: { cid, values, laborMarketAddress } }),
      });
    }
  }, [approveTransactor, approved, laborMarketAddress, submitTransactor, values, contracts]);

  const methods = useForm<ServiceRequestForm>({
    resolver: zodResolver(ServiceRequestFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ServiceRequestForm) => {
    approveTransactor.start({
      metadata: {},
      config: () =>
        configureWrite({
          address: values.rewardToken,
          abi: [
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
          ],
          functionName: "approve",
          args: [laborMarketAddress, toTokenAmount(values.rewardPool, values.rewardTokenDecimals)],
        }),
    });
    setValues(values);
  };

  return (
    <FormProvider {...methods}>
      {!approved && (
        <TxModal
          transactor={approveTransactor}
          title="Approve Challenge"
          confirmationMessage={"Approve the app to transfer the tokens on your behalf"}
        />
      )}
      {approved && (
        <TxModal
          transactor={submitTransactor}
          title="Launch Challenge"
          confirmationMessage={"Confirm that you would like to launch this challenge and transfer the funds"}
        />
      )}

      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10 py-5">
        <Step1Fields validProjects={projects} />
      </form>
    </FormProvider>
  );
}

function configureFromValues({
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    cid: string;
    values: ServiceRequestForm;
    laborMarketAddress: EvmAddress;
  };
}) {
  const { values, cid, laborMarketAddress } = inputs;
  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(values.endDate, values.endTime)));

  return configureWrite({
    abi: contracts.LaborMarket.abi,
    address: laborMarketAddress,
    functionName: "submitRequest",
    args: [
      values.rewardToken,
      toTokenAmount(values.rewardPool, values.rewardTokenDecimals),
      BigNumber.from(unixTimestamp(signalDeadline)),
      BigNumber.from(unixTimestamp(new Date(parseDatetime(values.endDate, values.endTime)))),
      BigNumber.from(unixTimestamp(new Date(parseDatetime(values.reviewEndDate, values.reviewEndTime)))),
      cid,
    ],
  });
}
