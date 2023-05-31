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
import type { AnalystForm, AppDataForm, ReviewerForm, ServiceRequestForm } from "./schema";
import { ServiceRequestFormSchema } from "./schema";
import { FinalStep } from "./overview-fields";

interface ServiceRequestFormProps {
  projects: Project[];
  tokens: Token[];
  defaultValues?: DefaultValues<ServiceRequestForm>;
  laborMarketAddress: EvmAddress;
  page1Data: AppDataForm | null;
  page2Data: AnalystForm | null;
  page3Data: ReviewerForm | null;
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
  defaultValues,
  laborMarketAddress,
  page1Data,
  page2Data,
  page3Data,
  tokens,
  projects,
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

  const onSubmit = (data: ServiceRequestForm) => {
    // write to contract with values
    approveTransactor.start({
      metadata: data.appData,
      config: ({ cid }) => configureFromValues({ contracts, inputs: { cid, form: data, laborMarketAddress } }),
    });
    setValues(data);
  };

  /*const onSubmit = (values: ServiceRequestForm) => {
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
  };*/

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

      <FinalStep
        onSubmit={onSubmit}
        tokens={tokens}
        projects={projects}
        address={laborMarketAddress}
        page1Data={page1Data}
        page2Data={page2Data}
        page3Data={page3Data}
      />
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
    form: ServiceRequestForm;
    laborMarketAddress: EvmAddress;
  };
}) {
  const { form, cid, laborMarketAddress } = inputs;
  const currentDate = new Date();
  console.log(form.analystData);
  const signalDeadline = new Date(
    claimDate(currentDate, parseDatetime(form.analystData.endDate, form.analystData.endTime))
  );

  return configureWrite({
    abi: contracts.LaborMarket.abi,
    address: laborMarketAddress,
    functionName: "submitRequest",
    args: [
      0, // Ok to hardcode here. Nonce is used to prevent duplicate ids in multicall.
      {
        pTokenProvider: form.analystData.rewardToken,
        pTokenProviderTotal: toTokenAmount(form.analystData.rewardPool, form.analystData.rewardTokenDecimals),
        pTokenReviewer: form.reviewerData.rewardToken,
        pTokenReviewerTotal: toTokenAmount(form.reviewerData.rewardPool, form.reviewerData.rewardTokenDecimals),
        providerLimit: BigNumber.from(form.analystData.submitLimit),
        reviewerLimit: BigNumber.from(form.reviewerData.reviewLimit),
        enforcementExp: unixTimestamp(
          new Date(parseDatetime(form.reviewerData.reviewEndDate, form.reviewerData.reviewEndTime))
        ),
        signalExp: unixTimestamp(signalDeadline),
        submissionExp: unixTimestamp(new Date(parseDatetime(form.analystData.endDate, form.analystData.endTime))),
      },
      cid,
    ],
  });
}
