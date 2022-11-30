import { useState } from "react";
import { Modal } from "./modal";

export const Basic = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </button>
      <Modal title="Payment Success" isOpen={open} onClose={() => setOpen(false)}>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order.
          </p>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setOpen(false)}
          >
            Got it, thanks!
          </button>
        </div>
      </Modal>
    </>
  );
};
