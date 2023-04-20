import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button, Modal } from "~/components";

export default function DeleteMarketModal() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="border border-gray-500 p-3 rounded cursor-pointer" onClick={() => setOpen(true)}>
        <TrashIcon className="text-gray-500 h-4 w-4" />
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} closeButton={false}>
        <div className="px-8 space-y-2">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mx-auto my-4" />
          <h3 className="font-base text-center">Are you sure you want to delete this Marketplace?</h3>
          <p className="text-center font-sm text-stone-500 mb-6">
            All information will be removed and you will not be able to retrieve it.
          </p>
          <div className="flex gap-2">
            <Button variant="cancel" fullWidth={true}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" fullWidth={true}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
