import {
  CheckboxCheckedFilled16,
  ChevronSort16,
  ChevronSortDown16,
  ChevronSortUp16,
  WarningSquareFilled16,
} from "@carbon/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";

export default function PayoutAddresses() {
  const [openedUpdate, setOpenedUpdate] = useState(false);
  const [openedRemove, setOpenedRemove] = useState(false);

  const validAddress = false;
  const wallets = [
    { address: "0x75638840948190490890", chain: "Ethereum", user: "idk", userId: 22, isConnected: true },
    { address: "0x32849854983758727987", chain: "Ethereum", user: "idk", userId: 22, isConnected: true },
    { address: "0x75638945875290490238", chain: "Solana", user: "idk", userId: 22, isConnected: true },
    { address: "0x32849854983758727987", chain: "Solana", user: "idk", userId: 22, isConnected: true },
  ];

  return (
    <>
      <Modal isOpen={openedUpdate} onClose={() => setOpenedUpdate(false)} title="Update address">
        <div className="space-y-5 mt-5">
          <div className="space-y-2">
            <div className="flex border-solid border rounded-md border-[#DEDEDE]">
              <p className="text-sm font-semibold border-solid border-0 border-r border-[#DEDEDE] p-3">SOL</p>
              <div className="flex items-center ml-2">
                {validAddress ? (
                  <CheckboxCheckedFilled16 className="mr-1 text-[#68C132]" />
                ) : (
                  <WarningSquareFilled16 className="mr-1 text-[#EC5962]" />
                )}
                <input id="update" placeholder="Update address" />
              </div>
            </div>
            {validAddress ? (
              <></>
            ) : (
              <p className="text-xs text-red-500">Please enter a valid address. If you are having issues go here</p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedUpdate(false)}>
              Cancel
            </Button>
            <Button disabled={!validAddress}>Save</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={openedRemove} onClose={() => setOpenedRemove(false)} title="Are you sure you want to remove?">
        <div className="space-y-5 mt-5">
          <div className="flex border-solid border rounded-md border-[#DEDEDE] items-center">
            <p className="text-sm font-semibold border-solid border-0 border-r border-[#DEDEDE] p-3">SOL</p>
            <p className="pl-2">0x381764734678365783648</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedRemove(false)}>
              Cancel
            </Button>
            <Button>Remove</Button>
          </div>
        </div>
      </Modal>
      <div className="container mx-auto px-10 space-y-7 mb-12">
        {/* Header (hide on mobile) */}
        <div className="hidden lg:grid grid-cols-5 gap-x-1 items-end px-2">
          <SortButton title="Chain/Project" label="todo" />
          <div className="col-span-2">
            <SortButton title="Address" label="todo" />
          </div>
          <SortButton title="Last Updated" label="todo" />
        </div>
        {/* Rows */}
        {wallets.length < 1 ? (
          <div className="flex">
            <p className="text-gray-500 mx-auto py-12">Add payout addresses and begin earning!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((w: { address: string; chain: string }) => {
              return (
                <div
                  // On mobile, two column grid with "labels". On desktop hide the "labels".
                  className="grid grid-cols-2 lg:grid-cols-5 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
                  key={w.address}
                >
                  <div className="lg:hidden">Chain/Project</div>
                  <p>project</p>
                  <div className="lg:hidden">Address</div>
                  <div className="lg:col-span-2">
                    <p className="text-black">{w.address}</p>
                  </div>
                  <div className="lg:hidden">Last Updated</div>
                  <p className="text-black">{formatTime("1999-01-01")} </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="cancel" onClick={() => setOpenedRemove(true)}>
                      Remove
                    </Button>
                    <Button variant="primary" onClick={() => setOpenedUpdate(true)}>
                      Update
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function formatTime(time: string | number | Date) {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
}

function SortButton({ label, title }: { label: string; title: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const onSort = (header: string) => {
    searchParams.set("sortBy", header);
    if (searchParams.get("order") === "asc") {
      searchParams.set("order", "desc");
    } else {
      searchParams.set("order", "asc");
    }
    setSearchParams(searchParams);
  };

  return (
    <button onClick={() => onSort(label)} className="flex">
      <p>{title}</p>
      {searchParams.get("sortBy") === label ? (
        searchParams.get("order") === "asc" ? (
          <ChevronSortUp16 className="mt-2" />
        ) : (
          <ChevronSortDown16 />
        )
      ) : (
        <ChevronSort16 className="mt-1" />
      )}
    </button>
  );
}
