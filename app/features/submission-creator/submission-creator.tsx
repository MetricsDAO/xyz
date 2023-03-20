import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import type { ethers } from "ethers";
import { BigNumber } from "ethers";
import { LaborMarket } from "labor-markets-abi";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Field, Input, Error, Button } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import type { SubmissionForm } from "./schema";
import { SubmissionFormSchema } from "./schema";

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

export default function SubmissionCreator({
  laborMarketAddress,
  serviceRequestId,
}: {
  laborMarketAddress: EvmAddress;
  serviceRequestId: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionForm>({
    resolver: zodResolver(SubmissionFormSchema),
  });

  const navigate = useNavigate();

  const transactor = useTransactor({
    onSuccess: useCallback(
      (receipt) => {
        console.log("receipt", receipt);
        const iface = LaborMarket__factory.createInterface();
        const event = getEventFromLogs(iface, receipt.logs, "RequestFulfilled", laborMarketAddress);
        if (event) navigate(`/app/market/${laborMarketAddress}/request/${event.args["requestId"]?.toString()}`);
      },
      [navigate, laborMarketAddress]
    ),
  });

  const onSubmit = (values: SubmissionForm) => {
    transactor.start({
      metadata: values,
      config: ({ cid }) => configureFromValues({ cid, address: laborMarketAddress, serviceRequestId }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-5">
        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="font-bold">Submission Title</h2>
            <Field>
              <Input {...register("title")} placeholder="Submission Title" className="w-full" />
              <Error error={errors.title?.message} />
            </Field>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold">Public link to your work</h2>
            <Field>
              <Input {...register("description")} placeholder="Public link to your work" />
              <Error error={errors.description?.message} />
            </Field>
            <p className="italic text-gray-500 text-sm">
              Important: You can’t edit this link after submitting. Double check that this link to work is correct,
              owned by you, published, and public.{" "}
              <i className="text-blue-600">
                <a href="https://docs.metricsdao.xyz/metricsdao/code-of-conduct#plagiarism-17">
                  Plagiarism Code of Conduct.
                </a>
              </i>
            </p>
          </section>
        </div>
        <Button type="submit">Next</Button>
      </form>
    </>
  );
}

function configureFromValues({
  cid,
  address,
  serviceRequestId,
}: {
  cid: string;
  address: EvmAddress;
  serviceRequestId: string;
}) {
  return configureWrite({
    abi: LaborMarket.abi,
    address: address,
    functionName: "provide",
    args: [BigNumber.from(serviceRequestId), cid],
  });
}
