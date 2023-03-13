import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Token } from "@prisma/client";
import { useNavigate, useParams } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { LaborMarket, LaborMarketNetwork } from "labor-markets-abi";
import { useCallback } from "react";
import type { DefaultValues } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketNetwork__factory } from "~/contracts";
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

  const methods = useForm<ServiceRequestForm>({
    resolver: zodResolver(ServiceRequestFormSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketNetwork__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "submitRequest");
        if (event) navigate(`/app/market/${event.args["marketAddress"]}/request/${event.args["requestId"]}}`);
      },
      [navigate]
    ),
  });

  const onSubmit = (values: ServiceRequestForm) => {
    transactor.start({
      metadata: {
        title: values.title,
        description: values.description,
        language: values.language,
        projectSlugs: values.projectSlugs,
      },
      config: ({ cid }) => configureFromValues({ cid, values }),
    });
  };

  return (
    <FormProvider {...methods}>
      <TxModal transactor={transactor} />
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
