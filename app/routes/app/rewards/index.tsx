import {
  CheckboxCheckedFilled16,
  ChevronSort16,
  ChevronSortDown16,
  ChevronSortUp16,
  Search16,
} from "@carbon/icons-react";
import { useSearchParams } from "@remix-run/react";
import { useRef } from "react";
import { z } from "zod";
import { Checkbox } from "~/components/Checkbox";
import { Pagination } from "~/components/Pagination";
import { Modal } from "~/components/modal";
import { Input } from "~/components/Input";
import { Button } from "~/components/button";
import { Avatar } from "~/components/avatar";
import { useState } from "react";
import { Combobox } from "~/components/Combobox";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { Container } from "~/components/Container";
import RewardsTab from "~/components/RewardsTab";
import { Card } from "~/components/Card";
import { fromNow } from "~/utils/date";

export default function Rewards() {
  //to be replaced
  const rewards = [{ id: 123, title: "silly string" }];
  const totalResults = rewards.length;
  const params = { first: 1, page: 1 };

  return (
    <Container className="py-16 px-10">
      <section className="space-y-2 max-w-3xl mb-16">
        <h1 className="text-3xl font-semibold">Rewards</h1>
        <div>
          <p className="text-lg text-cyan-500">Claim reward tokens for all the challenges you’ve won</p>
          <p className="text-gray-500 text-sm">
            View all your pending and claimed rewards and manage all your payout addresses
          </p>
        </div>
      </section>
      <RewardsTab rewardsNum={rewards.length} addressesNum={22} />
      <section className="flex flex-col-reverse md:flex-row space-y-reverse gap-y-7 gap-x-5">
        <main className="flex-1">
          <div className="space-y-5">
            <RewardsTable rewards={rewards} />
            <div className="w-fit m-auto">
              <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
            </div>
          </div>
        </main>
        <aside className="md:w-1/4 lg:md-1/5">
          <SearchAndFilter />
        </aside>
      </section>
    </Container>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function RewardsTable({ rewards }: { rewards: any }) {
  const unclaimed = true;

  if (rewards.length === 0) {
    return (
      <div className="flex">
        <p className="text-gray-500 mx-auto py-12">Participate in Challenges and start earning!</p>
      </div>
    );
  }

  return (
    <>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <div className="col-span-2">
          <SortButton title="Challenge Title" label="todo" />
        </div>
        <SortButton title="Reward" label="todo" />
        <SortButton title="Submitted" label="todo" />
        <SortButton title="Rewarded" label="todo" />
        <SortButton title="Status" label="todo" />
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {rewards.map((r: { id: string; title: string }) => {
          return (
            <Card
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center px-2 py-5"
              key={r.id}
            >
              <div className="lg:hidden">Challenge Title</div>
              <div className="lg:col-span-2">
                <p>{r.title}</p>
              </div>
              <div className="lg:hidden">Reward</div>
              <p>20 SOL</p>
              <div className="lg:hidden">Submitted</div>
              <p className="text-black">{fromNow("2022-01-01")} </p>
              <div className="lg:hidden">Rewarded</div>
              <p className="text-black" color="dark.3">
                {fromNow("2022-11-01")}{" "}
              </p>
              <div className="lg:hidden">Status</div>
              {unclaimed ? <ClaimButton /> : <Button variant="cancel">View Tx</Button>}
            </Card>
          );
        })}
      </div>
    </>
  );
}

function ClaimButton() {
  const [opened, setOpened] = useState(false);
  const [openedProcess, setOpenedProcess] = useState(false);

  function processClaim() {
    setOpened(false);
    setOpenedProcess(true);
  }
  return (
    <>
      <Button onClick={() => setOpened(true)}>Claim</Button>
      <Modal isOpen={opened} onClose={() => setOpened(false)} title="Claim your reward!">
        <div className="space-y-5 mt-5">
          <div className="space-y-2">
            <div className="flex items-center">
              <Avatar src="/img/trophy.svg" />
              <p className="text-yellow-700 text-2xl ml-2">10 SOL</p>
            </div>
            <div className="flex border-solid border rounded-md border-trueGray-200">
              <p className="text-sm font-semiboldborder-solid border-0 border-r border-trueGray-200 p-3">SOL</p>
              <div className="flex items-center p-3">
                <CheckboxCheckedFilled16 className="mr-1 text-lime-500" />
                <p className="text-sm text-gray-600">0xs358437485395889094</p>
              </div>
            </div>
            <p className="text-xs">To chage or update this address head to Payout Addresses</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={() => processClaim()}>Claim</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={openedProcess} onClose={() => setOpenedProcess(false)}>
        <div className="mx-auto space-y-7">
          <img src="/img/check-circle.svg" alt="" className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-center text-2xl font-semibold">Claim proccessing</h1>
            <p className="text-gray-500 text-center text-md">
              {"This transaction could take up to {x amount of time}. Please check back in a bit."}
            </p>
            <p className="text-gray-500 text-center text-sm">
              {"If there are any issues please reach out to {discord?}"}
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="cancel" fullWidth>
              Cancel
            </Button>
            <Button fullWidth>Got it</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function SearchAndFilter() {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <ValidatedForm
      formRef={ref}
      method="get"
      noValidate
      validator={withZod(z.any())}
      className="space-y-3 p-3 border-[1px] border-solid border-gray-100 rounded-md bg-blue-300 bg-opacity-5"
    >
      <Input placeholder="Search" name="q" iconLeft={<Search16 className="w-5 h-5 ml-2" />} />
      <p className="text-lg font-semibold">Filter:</p>
      <p>Status</p>
      <Checkbox value="unclaimed" label="Unclaimed" />
      <Checkbox value="claimed" label="Claimed" />
      <Combobox
        label="Reward Token"
        placeholder="Select option"
        name="rewardToken"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
      <Combobox
        label="Challenge Marketplace"
        placeholder="Select option"
        name="challengeMarketplace"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
        ]}
      />
    </ValidatedForm>
  );
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
