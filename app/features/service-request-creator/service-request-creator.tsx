import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { useNavigate, useParams } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { LaborMarket, LaborMarketNetwork } from "labor-markets-abi";
import { useCallback, useEffect, useState } from "react";
import type { DefaultValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import invariant from "tiny-invariant";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketNetwork__factory, LaborMarket__factory } from "~/contracts";
import type { ServiceRequestForm } from "~/domain/service-request/schemas";
import { ServiceRequestFormSchema } from "~/domain/service-request/schemas";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { claimDate, parseDatetime, unixTimestamp } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";
import { Button } from "../../components/button";
import { ServiceRequestCreatorFields } from "./service-request-creator-fields.tsx";

interface ServiceRequestFormProps {
  projects: Project[];
  tokens: Token[];
  defaultValues?: DefaultValues<ServiceRequestForm>;
}

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(iface: ethers.utils.Interface, logs: ethers.providers.Log[], eventName: string) {
  return logs
    .filter((log) => log.address === LaborMarketNetwork.address)
    .map((log) => iface.parseLog(log))
    .find((e) => e.name === eventName);
}

export function ServiceRequestCreator({ projects, tokens, defaultValues }: ServiceRequestFormProps) {
  const { mType } = useParams();

  const [values, setValues] = useState<ServiceRequestForm>();
  const [approved, setApproved] = useState(false);

  const navigate = useNavigate();

  const submitTransactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarket__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "RequestConfigured");
        console.log("event", event?.args["requestId"]);
        if (event) navigate(`/app/market/${event.args["marketAddress"]}/request/${event.args["requestId"]}`);
      },
      [navigate]
    ),
  });

  const approveTransactor = useTransactor({
    onSuccess: useCallback((receipt) => {
      const iface = LaborMarket__factory.createInterface();
      const event = getEventFromLogs(iface, receipt.logs, "Approve");
    }, []),
  });

  useEffect(() => {
    if (values && approveTransactor.state === "success" && !approved) {
      setApproved(true);
      submitTransactor.start({
        metadata: {
          title: values.title,
          description: values.description,
          language: values.language,
          projectSlugs: values.projectSlugs,
        },
        config: ({ cid }) => configureFromValues({ cid, values }),
      });
    }
  }, [approveTransactor, approved, submitTransactor, values]);

  const methods = useForm<ServiceRequestForm>({
    resolver: zodResolver(ServiceRequestFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ServiceRequestForm) => {
    approveTransactor.start({
      metadata: {},
      config: () =>
        configureWrite({
          address: values.rewardToken as `0x${string}`,
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
          args: [LaborMarket.address, toTokenAmount(values.rewardPool)],
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
        <ServiceRequestCreatorFields validTokens={tokens} validProjects={projects} mType={mType} />
        <Button size="lg" type="submit">
          Next
        </Button>
      </form>
    </FormProvider>
  );
}

function configureFromValues({ cid, values }: { cid: string; values: ServiceRequestForm }) {
  const currentDate = new Date();
  const signalDeadline = new Date(claimDate(currentDate, parseDatetime(values.endDate, values.endTime)));

  return configureWrite({
    abi: LaborMarket.abi,
    address: LaborMarket.address,
    functionName: "submitRequest",
    args: [
      values.rewardToken as `0x${string}`,
      toTokenAmount(values.rewardPool),
      BigNumber.from(unixTimestamp(signalDeadline)),
      BigNumber.from(unixTimestamp(new Date(parseDatetime(values.endDate, values.endTime)))),
      BigNumber.from(unixTimestamp(new Date(parseDatetime(values.reviewEndDate, values.reviewEndTime)))),
      cid,
    ],
  });
}
