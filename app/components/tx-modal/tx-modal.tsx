import type { Transactor } from "~/hooks/use-transactor";
import { Button } from "../button";
import { Modal } from "../modal";

export function TxModal({ transactor }: { transactor: Transactor }) {
  return (
    <Modal isOpen={transactor.state !== "idle"} onClose={transactor.cancel}>
      <div className="px-8 text-center mb-8 space-y-4">
        <h1 className="text-base font-medium">Create Marketplace</h1>

        {transactor.state === "preparing" ? <div>Preparing...</div> : null}

        {transactor.state === "failure" ? (
          <div className="text-rose-500 space-y-3">
            <p>Something went wrong in your transaction</p>
            <p>{transactor.error}</p>
          </div>
        ) : null}

        {transactor.state === "prepared" ? (
          <p className="text-sm text-gray-600">Confirm that you would like to create a new marketplace.</p>
        ) : null}

        {transactor.state === "writing" ? <div>Writing...</div> : null}

        {transactor.state === "waiting" ? <div>Waiting for confirmation...</div> : null}
      </div>

      {transactor.state === "prepared" ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="cancel" size="md" onClick={transactor.cancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={transactor.write}>
            Create
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
