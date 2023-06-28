import type { Transactor } from "~/hooks/use-transactor";
import { Button } from "../button";
import { Modal } from "../modal";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

type Props = {
  transactor: Transactor;
  title?: string;
  confirmationMessage?: React.ReactNode;
  variant?: "primary" | "danger";
};

export function TxModal({ transactor, title, confirmationMessage, variant = "primary" }: Props) {
  return (
    <Modal isOpen={transactor.state !== "idle" && transactor.state !== "success"} onClose={transactor.cancel}>
      <div className="px-8 text-center mb-8 space-y-4">
        {variant === "danger" && <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto my-4" />}
        <h1 className="text-base font-medium">{title ?? "Execute transaction"}</h1>

        {transactor.state === "preparing" ? <div>Preparing...</div> : null}

        {transactor.state === "failure" ? (
          <div className="text-rose-500 space-y-3">
            <p>Something went wrong in your transaction</p>
            <p>{transactor.error}</p>
          </div>
        ) : null}

        {transactor.state === "prepared" ? (
          <p className="text-sm text-gray-600">
            {confirmationMessage ?? "Confirm that you would like to execute this transaction."}
          </p>
        ) : null}

        {transactor.state === "writing" ? <div>Writing...</div> : null}

        {transactor.state === "waiting" ? (
          <div className="space-y-2">
            <p>Waiting for confirmation...</p>
            <a
              className="text-blue-600"
              target="_blank"
              href={`https://polygonscan.com/tx/${transactor.transactionHash}`}
              rel="noreferrer"
            >
              View on polygonscan
            </a>
          </div>
        ) : null}

        {transactor.state === "redirect" ? (
          <div className="space-y-2">
            <p>Transaction confirmed! Redirecting...</p>
            <a
              className="text-blue-600"
              target="_blank"
              href={`https://polygonscan.com/tx/${transactor.receipt.transactionHash}`}
              rel="noreferrer"
            >
              View on polygonscan
            </a>
          </div>
        ) : null}
      </div>

      {transactor.state === "prepared" ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="cancel" size="md" onClick={transactor.cancel}>
            Cancel
          </Button>
          <Button variant={variant} size="md" onClick={transactor.write}>
            {variant === "primary" ? "Confirm" : "Delete"}
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
