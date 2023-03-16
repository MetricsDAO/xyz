import { Button } from "../../components/button";
import { useNavigate } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LaborMarket, LaborMarketNetwork } from "labor-markets-abi";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketNetwork__factory } from "~/contracts";
import { useCallback } from "react";
import type { SubmissionForm } from "~/domain/submission/schemas";
import { SubmissionFormSchema } from "~/domain/submission/schemas";
import SubmissionCreatorFields from "./submission-creator-fields";

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(iface: ethers.utils.Interface, logs: ethers.providers.Log[], eventName: string) {
  return logs
    .filter((log) => log.address === LaborMarketNetwork.address)
    .map((log) => iface.parseLog(log))
    .find((e) => e.name === eventName);
}

export default function SubmissionCreator({
  type,
  laborMarketAddress,
  serviceRequestId,
}: {
  type: "brainstorm" | "analyze";
  laborMarketAddress: string;
  serviceRequestId: string;
}) {
  const methods = useForm<SubmissionForm>({
    resolver: zodResolver(SubmissionFormSchema),
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketNetwork__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "provide");
        if (event) navigate(`/app/market/${event.args["marketAddress"]}/submission/${event.args["submissionId"]}}`);
      },
      [navigate]
    ),
  });

  const onSubmit = (values: SubmissionForm) => {
    transactor.start({
      metadata: values,
      config: ({ cid }) => configureFromValues({ cid, address: laborMarketAddress as `0x${string}`, serviceRequestId }),
    });
  };
  return (
    <FormProvider {...methods}>
      <TxModal transactor={transactor} />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10 py-5">
        <SubmissionCreatorFields type={type} />
        <Button type="submit">Next</Button>
      </form>
    </FormProvider>
  );
}

function configureFromValues({
  cid,
  address,
  serviceRequestId,
}: {
  cid: string;
  address: `0x${string}`;
  serviceRequestId: string;
}) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: address,
    functionName: "provide",
    args: [BigNumber.from(serviceRequestId), cid],
  });
}
