import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { notFound } from "remix-utils";
import { z } from "zod";
import { findChallenge } from "~/services/challenges-service.server";
import { Container } from "~/components/container";
import { CountdownCard } from "~/components/countdown-card";
import { Button } from "~/components/button";
import { Badge } from "~/components/badge";
import type { ClaimToSubmitPrepared } from "~/domain";
import { useState } from "react";
import invariant from "tiny-invariant";
import { useClaimToSubmit } from "~/hooks/use-claim-to-submit";
import toast from "react-hot-toast";
import { Modal } from "~/components";

const paramsSchema = z.object({ laborMarketAddress: z.string(), serviceRequestId: z.string() });
export const loader = async ({ params }: DataFunctionArgs) => {
  const { serviceRequestId, laborMarketAddress } = paramsSchema.parse(params);
  const challenge = await findChallenge(serviceRequestId, laborMarketAddress);
  if (!challenge) {
    throw notFound({ id: serviceRequestId });
  }

  return typedjson({ challenge }, { status: 200 });
};

export default function ClaimToSubmit() {
  const { challenge } = useTypedLoaderData<typeof loader>();

  const [modalData, setModalData] = useState<{ data?: ClaimToSubmitPrepared; isOpen: boolean }>({ isOpen: false });

  function closeModal() {
    setModalData((challenge) => ({ challenge, isOpen: false }));
  }

  return (
    <Container className="max-w-4xl space-y-7 mb-12 mt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Claim to Submit on {challenge.title}</h1>
        <h2 className="text-xl text-cyan-500">Claiming is an up front commitment to submit at least one submission</h2>
        <p className="text-gray-500">
          You must temporarily lock rMETRIC to claim. If you claim and don't submit before the deadline, all your locked
          rMETRIC will be slashed.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">How Claiming to Submit Works</h3>
        <ul className="list-disc list-inside text-gray-500 space-y-1">
          <li>Commit to entering at least one submission by locking rMETRIC against this challenge</li>
          <li>Enter at least one submission before the submission deadline</li>
          <li>If you submit before the deadline, your rMETRIC will be unlocked</li>
          <li>If you don't submit before the deadline, all your locked rMETRIC will be slashed</li>
        </ul>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-5">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Claim to Submit Deadline</h2>
            <CountdownCard start={"2023-01-25"} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Submission Deadline</h2>
            <CountdownCard start={"2022-11-25"} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Lock rMETRIC</h2>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <p>
            You must lock <Badge>50</Badge> rMETRIC to claim
          </p>
          <Button variant="outline">Lock rMETRIC</Button>
        </div>
        <p className="mt-2 text-gray-500 italic">
          Important: If you don't submit before the deadline, all 50 of your locked rMETRIC will be slashed.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        <Button
          onClick={() => {
            setModalData({ isOpen: true, data: { serviceRequestId: 1 } });
          }}
        >
          Claim to Submit
        </Button>
        <Button variant="cancel">Cancel</Button>
      </div>
      <div className="invisible"></div>
      <Modal title="Claim to submit?" isOpen={modalData.isOpen} onClose={closeModal}>
        <ConfirmTransaction data={modalData.data} onClose={closeModal} />
      </Modal>
    </Container>
  );
}

function ConfirmTransaction({ data, onClose }: { data?: ClaimToSubmitPrepared; onClose: () => void }) {
  invariant(data, "ClaimToSubmitPrepared is required"); // this should never happen but just in case

  const { write, isLoading } = useClaimToSubmit({
    data: data,
    onTransactionSuccess() {
      toast.dismiss("claiming-to-submit");
      toast.success("Challenge Claimed!");
    },
    onWriteSuccess() {
      toast.loading("Claiming challenge to submit...", { id: "claiming-to-submit" });
    },
  });

  const onCreate = () => {
    write?.();
  };

  return (
    <div className="space-y-8 mt-4">
      <p>Are you sure you want to claim a submission for this challenge?</p>
      <div className="flex flex-wrap gap-5">
        <Button loading={isLoading} onClick={onCreate}>
          Claim
        </Button>
        <Button variant="cancel" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}