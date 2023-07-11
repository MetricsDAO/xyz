import { Link } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";

export function NoPayoutAddressFoundModalButton({
  buttonText,
  networkName,
}: {
  buttonText: string;
  networkName?: string;
}) {
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setConfirmedModalOpen(true)}>{buttonText}</Button>
      <Modal isOpen={confirmedModalOpen} onClose={() => setConfirmedModalOpen(false)} title="Claim your reward!">
        <p className="my-5">
          No address found for <b>{networkName ?? "Unknown Network"}</b>. To add an address head to{" "}
          <Link to="/app/rewards/addresses" className="text-blue-600">
            Payout Addresses
          </Link>
        </p>
      </Modal>
    </>
  );
}
