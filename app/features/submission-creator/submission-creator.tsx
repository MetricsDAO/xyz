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
import type { SubmissionContract, SubmissionForm } from "~/domain/submission/schemas";
import { SubmissionFormSchema } from "~/domain/submission/schemas";
import type { EvmAddress } from "~/domain/address";
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

export default function SubmissionCreator({ type }: { type: "brainstorm" | "analyze" }) {
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
      //todo - pass in lm address and correct data config: ({ account, cid }) => configureFromValues({ owner: account, cid, values }),
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

function configureFromValues({ values, address }: { values: SubmissionForm; address: `0x${string}` }) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: address,
    functionName: "provide",
    args: [BigNumber.from(values.serviceRequestId), values.uri],
  });
}
