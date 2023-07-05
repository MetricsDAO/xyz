import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Field, Input, Error, Button } from "~/components";
import { TxModal } from "~/components/tx-modal/tx-modal";
import { LaborMarket__factory } from "~/contracts";
import type { EvmAddress } from "~/domain/address";
import { useContracts } from "~/hooks/use-root-data";
import { configureWrite, useTransactor } from "~/hooks/use-transactor";
import { postNewEvent } from "~/utils/fetch";
import { getEventFromLogs } from "~/utils/helpers";
import type { SubmissionForm } from "./schema";
import { SubmissionFormSchema } from "./schema";

export default function SubmissionCreator({
  laborMarketAddress,
  serviceRequestId,
}: {
  laborMarketAddress: EvmAddress;
  serviceRequestId: string;
}) {
  const contracts = useContracts();
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
        const iface = LaborMarket__factory.createInterface();
        const event = getEventFromLogs(laborMarketAddress, iface, receipt.logs, "RequestFulfilled");
        if (event) {
          postNewEvent({
            eventFilter: "RequestFulfilled",
            address: laborMarketAddress,
            blockNumber: receipt.blockNumber,
            transactionHash: receipt.transactionHash,
          }).then(() => navigate(`/app/market/${laborMarketAddress}/request/${serviceRequestId}`));
        }
      },
      [laborMarketAddress, navigate, serviceRequestId]
    ),
  });

  const onSubmit = (values: SubmissionForm) => {
    transactor.start({
      metadata: values,
      config: ({ cid }) => configureFromValues({ contracts, inputs: { cid, laborMarketAddress, serviceRequestId } }),
    });
  };

  return (
    <>
      <TxModal transactor={transactor} redirectStep={true} />
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
              <Input {...register("submissionUrl")} placeholder="Public link to your work" />
              <Error error={errors.submissionUrl?.message} />
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
  contracts,
  inputs,
}: {
  contracts: ReturnType<typeof useContracts>;
  inputs: {
    cid: string;
    laborMarketAddress: EvmAddress;
    serviceRequestId: string;
  };
}) {
  return configureWrite({
    abi: contracts.LaborMarket.abi,
    address: inputs.laborMarketAddress,
    functionName: "provide",
    args: [BigNumber.from(inputs.serviceRequestId), inputs.cid],
  });
}
