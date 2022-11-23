import {
  CheckboxCheckedFilled16,
  ChevronSort16,
  ChevronSortDown16,
  ChevronSortUp16,
  Copy16,
  WarningSquareFilled16,
} from "@carbon/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import { Container } from "~/components/Container";
import RewardsTab from "~/components/RewardsTab";
import { Card } from "~/components/Card";

export default function PayoutAddresses() {
  const validAddress = false;
  const wallets = [
    { address: "0x75638840948190490890", chain: "Ethereum", user: "idk", userId: 22, isConnected: true },
    { address: "0x32849854983758727987", chain: "Ethereum", user: "idk", userId: 22, isConnected: true },
    { address: "0x75638945875290490238", chain: "Solana", user: "idk", userId: 22, isConnected: true },
    { address: "0x32849854983758727987", chain: "Solana", user: "idk", userId: 22, isConnected: true },
  ];

  if (wallets.length === 0) {
    return (
      <div className="flex">
        <p className="text-gray-500 mx-auto py-12">Add payout addresses and begin earning!</p>
      </div>
    );
  }

  return (
    <Container className="py-16 px-10">
      <div className="mb-16">
        <section className="flex flex-wrap gap-5 justify-between pb-2">
          <h1 className="text-3xl font-semibold">Manage Addresses</h1>
          <div className="flex flex-wrap gap-5 items-center">
            <AddAddressButton />
          </div>
        </section>
        <section className="max-w-3xl">
          <p className="text-lg text-cyan-500">Manage all your payout addresses to receive reward tokens</p>
          <p className="text-gray-500 text-sm">
            Reward tokens will automatically be sent to these wallets when you claim rewards
          </p>
        </section>
      </div>
      <RewardsTab rewardsNum={10} addressesNum={wallets.length} />
      <div className="space-y-7 mb-12">
        {/* Header (hide on mobile) */}
        <div className="hidden lg:grid grid-cols-5 gap-x-1 items-end px-2">
          <SortButton title="Chain/Project" label="todo" />
          <div className="col-span-2">
            <SortButton title="Address" label="todo" />
          </div>
          <SortButton title="Last Updated" label="todo" />
        </div>
        {/* Rows */}
        <div className="space-y-3">
          {wallets.map((w: { address: string; chain: string }) => {
            return (
              <Card
                // On mobile, two column grid with "labels". On desktop hide the "labels".
                className="grid grid-cols-2 lg:grid-cols-5 gap-y-3 gap-x-1 items-center px-2 py-5"
                key={w.address}
              >
                <div className="lg:hidden">Chain/Project</div>
                <p>project</p>
                <div className="lg:hidden">Address</div>
                <div className="lg:col-span-2 flex flex-row items-center gap-x-2">
                  {validAddress ? (
                    <CheckboxCheckedFilled16 className="text-lime-500" />
                  ) : (
                    <WarningSquareFilled16 className="text-rose-500" />
                  )}
                  <p className="text-black">{w.address}</p>
                  <Copy16 className="ml-0.5" />
                </div>
                <div className="lg:hidden">Last Updated</div>
                <p className="text-black">{formatTime("1999-01-01")} </p>
                <div className="flex flex-wrap gap-2">
                  <RemoveAddressButton />
                  <UpdateAddressButton />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

function AddAddressButton() {
  const [openedAdd, setOpenedAdd] = useState(false);
  const validAddress = false;

  return (
    <>
      <Button className="mx-auto" onClick={() => setOpenedAdd(true)}>
        Add Address
      </Button>
      <Modal isOpen={openedAdd} onClose={() => setOpenedAdd(false)} title="Add an address">
        <div className="space-y-5 mt-5">
          <div className="flex border-solid border rounded-md border-trueGray-200">
            <ChevronSortDown16 className="m-3" />

            <div className="flex items-center pl-2 border-solid border-0 border-l border-trueGray-200">
              {validAddress ? (
                <CheckboxCheckedFilled16 className="mr-1 text-lime-500" />
              ) : (
                <WarningSquareFilled16 className="mr-1 text-rose-500" />
              )}
              <input id="address" placeholder="Select a chain and enter an address" className="text-sm" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedAdd(false)}>
              Cancel
            </Button>
            <Button disabled={!validAddress}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function RemoveAddressButton() {
  const [openedRemove, setOpenedRemove] = useState(false);

  return (
    <>
      <Button variant="cancel" onClick={() => setOpenedRemove(true)}>
        Remove
      </Button>
      <Modal isOpen={openedRemove} onClose={() => setOpenedRemove(false)} title="Are you sure you want to remove?">
        <div className="space-y-5 mt-5">
          <div className="flex border-solid border rounded-md border-trueGray-200 items-center">
            <p className="text-sm font-semibold border-solid border-0 border-r border-trueGray-200 p-3">SOL</p>
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
    </>
  );
}

function UpdateAddressButton() {
  const [openedUpdate, setOpenedUpdate] = useState(false);

  const validAddress = false;

  return (
    <>
      <Button variant="primary" onClick={() => setOpenedUpdate(true)}>
        Update
      </Button>
      <Modal isOpen={openedUpdate} onClose={() => setOpenedUpdate(false)} title="Update address">
        <div className="space-y-5 mt-5">
          <div className="space-y-2">
            <div className="flex border-solid border rounded-md border-trueGray-200">
              <p className="text-sm font-semibold border-solid border-0 border-r border-trueGray-200 p-3">SOL</p>
              <div className="flex items-center ml-2">
                {validAddress ? (
                  <CheckboxCheckedFilled16 className="mr-1 text-lime-500" />
                ) : (
                  <WarningSquareFilled16 className="mr-1 text-rose-500" />
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
