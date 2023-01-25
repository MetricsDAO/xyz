import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { findServiceRequest } from "~/services/service-request.server";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";
import type { ClaimToSubmitPrepared } from "~/domain";
import { ClaimToSubmitContractSchema } from "~/domain";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { useClaimToSubmit } from "~/hooks/use-claim-to-submit";
import toast from "react-hot-toast";
import { Modal } from "~/components";
import { useParams } from "@remix-run/react";
import { ClaimToSubmitWeb3Button } from "~/features/web3-button/claim-to-submit";
import { useMachine } from "@xstate/react";
import { defaultNotifyTransactionActions } from "~/features/web3-transaction-toasts";
import { createBlockchainTransactionStateMachine } from "~/utils/machine";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { validationError } from "remix-validated-form";
import { getUser } from "~/services/session.server";
import { withZod } from "@remix-validated-form/with-zod";
import { isValidationError } from "~/utils/utils";

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { serviceRequestId, laborMarketAddress } = paramsSchema.parse(params);
  const serviceRequest = await findServiceRequest(serviceRequestId, laborMarketAddress);
  if (!serviceRequest) {
    throw notFound({ id: serviceRequestId });
  }

  return typedjson({ serviceRequest }, { status: 200 });
};

const validator = withZod(ClaimToSubmitContractSchema);

type ActionResponse = { claim: ClaimToSubmitPrepared } | ValidationErrorResponseData;
export const action = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  invariant(user, "You must be logged in to claim a submission");
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  return typedjson({ claim: result.data });
};

export default function ClaimToSubmit() {
  const actionData = useTypedActionData<ActionResponse>();

  const { serviceRequest } = useTypedLoaderData<typeof loader>();
  const { mType } = useParams();

  const [modalData, setModalData] = useState<{ data?: ClaimToSubmitPrepared; isOpen: boolean }>({ isOpen: false });

  const claimToSubmitMachine = createBlockchainTransactionStateMachine<ClaimToSubmitPrepared>();

  function closeModal() {
    setModalData((previousInputs) => ({ ...previousInputs, isOpen: false }));
  }

  const [state, send] = useMachine(claimToSubmitMachine, {
    actions: {
      notifyTransactionWait: (context) => {
        // Link to transaction? https://goerli.etherscan.io/address/${context.transactionHash}
        toast.loading("Creating marketplace...", { id: "creating-marketplace" });
      },
      notifyTransactionSuccess: () => {
        toast.dismiss("creating-marketplace");
        toast.success("Marketplace created!");
      },
      notifyTransactionFailure: () => {
        toast.dismiss("creating-marketplace");
        toast.error("Marketplace creation failed");
      },
    },
  });

  return (
    <Container className="max-w-4xl space-y-7 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Claim to Submit on {serviceRequest.title}</h1>
        <h2 className="text-lg text-cyan-500">
          Claiming is an up front commitment to submit at least one{" "}
          {mType === "brainstorm" ? "submission" : "dashboard"}
        </h2>
        <p className="text-gray-500 text-sm">
          You must temporarily lock rMETRIC to claim. If you claim and don't submit before the deadline, all your locked
          rMETRIC will be slashed.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">How Claiming to Submit Works</h3>
        <ul className="list-disc list-inside text-gray-500 space-y-1 text-sm">
          <li>Commit to entering at least one submission by locking rMETRIC against this challenge</li>
          <li>Enter at least one submission before the submission deadline</li>
          <li>If you submit before the deadline, your rMETRIC will be unlocked</li>
          <li>If you don't submit before the deadline, all your locked rMETRIC will be slashed</li>
        </ul>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-5">
          <div className="space-y-2">
            <h2 className="font-semibold pr-10">Claim to Submit Deadline</h2>
            <CountdownCard start={serviceRequest.createdAt} end={serviceRequest.signalExpiration} />
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold pr-16">Submission Deadline</h2>
            <CountdownCard start={serviceRequest.createdAt} end={serviceRequest.submissionExpiration} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Lock rMETRIC</h2>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <p className="text-sm">
            You must lock <Badge>50</Badge> rMETRIC to claim
          </p>
          <Button variant="outline">Lock rMETRIC</Button>
        </div>
        <p className="mt-2 text-gray-500 italic text-sm">
          Important: If you don't submit before the deadline, all 50 of your locked rMETRIC will be slashed.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button
          onClick={() => {
            setModalData({
              isOpen: true,
              data: {
                laborMarketAddress: serviceRequest.laborMarketAddress,
                serviceRequestId: serviceRequest.contractId,
              },
            });
          }}
        >
          Claim to Submit
        </Button>
        <Button variant="cancel">Cancel</Button>
      </div>
      <div className="invisible"></div>
      {state.context.contractData && (
        <Modal title="Create Marketplace?" isOpen={isModalOpen} onClose={closeModal}>
          <div className="space-y-8">
            <p>Please confirm that you would like to create a new marketplace.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <ClaimToSubmitWeb3Button data={state.context.contractData} onWriteSuccess={onWriteSuccess} />
              <Button variant="cancel" size="md" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}
