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
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { unixTimestamp } from "~/utils/date";
import { toTokenAmount } from "~/utils/helpers";
import { Button } from "../../components/button";
import { ServiceRequestCreatorFields } from "./service-request-creator-fields.tsx";
import type { ServiceRequestFormValues } from "./service-request-creator-values";
import { ServiceRequestFormValuesSchema } from "./service-request-creator-values";

interface ServiceRequestFormProps {
  projects: Project[];
  tokens: Token[];
  defaultValues?: DefaultValues<ServiceRequestFormValues>;
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

  const methods = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(ServiceRequestFormValuesSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketNetwork__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "RequestConfigured");
        if (event) navigate(`/app/market/${event.args["marketAddress"]}/request/${event.args["requestId"]}}`);
      },
      [navigate]
    ),
  });

  const onSubmit = (values: ServiceRequestFormValues) => {
    transactor.start({
      metadata: values.appData,
      config: ({ account, cid }) => configureFromValues({ owner: account, cid, values }),
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

function configureFromValues({
  owner,
  cid,
  values,
}: {
  owner: EvmAddress;
  cid: string;
  values: ServiceRequestFormValues;
}) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: values.laborMarketAddress as `0x${string}`,
    functionName: "submitRequest",
    args: [
      values.configuration.pToken as `0x${string}`,
      toTokenAmount(values.configuration.pTokenQuantity),
      BigNumber.from(unixTimestamp(values.configuration.signalExpiration)),
      BigNumber.from(unixTimestamp(values.configuration.submissionExpiration)),
      BigNumber.from(unixTimestamp(values.configuration.enforcementExpiration)),
      values.configuration.uri,
    ],
  });
}
