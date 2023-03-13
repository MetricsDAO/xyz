import SubmissionCreatorFields from "./submission-creator-fields";
import { Button } from "../../components/button";
import { useNavigate, useParams } from "@remix-run/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LaborMarketNetwork } from "labor-markets-abi";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarketNetwork__factory } from "~/contracts";
import { useCallback } from "react";
import type { SubmissionContract, SubmissionForm } from "~/domain/submission";
import { SubmissionFormSchema } from "~/domain/submission";
import type { EvmAddress } from "~/domain/address";

/**
 * Filters and parses the logs for a specific event.
 */
function getEventFromLogs(iface: ethers.utils.Interface, logs: ethers.providers.Log[], eventName: string) {
  return logs
    .filter((log) => log.address === LaborMarketNetwork.address)
    .map((log) => iface.parseLog(log))
    .find((e) => e.name === eventName);
}

export default function SubmissionCreator() {
  const { mType } = useParams();

  const methods = useForm<SubmissionForm>({
    resolver: zodResolver(SubmissionFormSchema),
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        const iface = LaborMarketNetwork__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "LaborMarketCreated");
        if (event) navigate(`/app/market/${event.args["marketAddress"]}`);
      },
      [navigate]
    ),
  });

  const onSubmit = (values: SubmissionContract) => {
    transactor.start({
      metadata: values,
      config: ({ account, cid }) => configureFromValues({ owner: account, cid, values }),
    });
  };
  return (
    <FormProvider {...methods}>
      <TxModal transactor={transactor} />
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10 py-5">
        <SubmissionCreatorFields type={mType} />
        <Button size="lg" type="submit">
          Next
        </Button>
      </form>
    </FormProvider>
  );
}

function configureFromValues({ owner, cid, values }: { owner: EvmAddress; cid: string; values: SubmissionContract }) {
  return configureWrite({
    abi: LaborMarketNetwork.abi,
    address: LaborMarketNetwork.address,
    functionName: "provide",
    args: [BigNumber.from(values.serviceRequestId), values.uri],
  });
}
