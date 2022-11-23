import {
  ChevronSort16,
  ChevronSortDown16,
  ChevronSortUp16,
  Search16,
  WarningAltFilled16,
  WarningAltFilled32,
} from "@carbon/icons-react";
import { useSearchParams } from "@remix-run/react";
import { useRef, useState } from "react";
import { Button } from "~/components/button";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/Checkbox";
import { Input } from "~/components/Input";
import { Modal } from "~/components/modal";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { Combobox } from "~/components/Combobox";
import { Pagination } from "~/components/Pagination";

export default function IOUTab() {
  //to be replaced
  const rewards = [{ id: 123, name: "silly string" }];
  const totalResults = rewards.length;
  const params = { first: 1, page: 1 };

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
      <main className="flex-1 space-y-4">
        <IOUTable iouTokens={rewards} />
        <div className="w-fit m-auto">
          <Pagination page={params.page} totalPages={Math.ceil(totalResults / params.first)} />
        </div>
      </main>
      <aside className="md:1/4 lg:w-1/5">
        <SearchAndFilter />
      </aside>
    </section>
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
      <Input placeholder="Search" name="q" iconLeft={<Search16 className="ml-2" />} />
      <p className="text-lg font-semibold">Filter</p>
      <Checkbox value="noBalance" label="No available balance" />
      <Combobox
        label="iouToken"
        placeholder="Select option"
        name="iouToken"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
    </ValidatedForm>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function IOUTable({ iouTokens }: { iouTokens: any }) {
  const [openedBurn, setOpenedBurn] = useState(false);
  const [openedAlert, setOpenedAlert] = useState(false);
  const [openedIssue, setOpenedIssue] = useState(false);
  if (iouTokens.length === 0) {
    return (
      <div className="flex py-16">
        <p className="mx-auto text-gray-500">No iouTokens circulating</p>
      </div>
    );
  }

  function closeAlert() {
    setOpenedAlert(false);
    setOpenedIssue(true);
  }
  return (
    <>
      <Modal isOpen={openedAlert} onClose={() => setOpenedAlert(false)}>
        <div className="mx-auto space-y-7">
          <WarningAltFilled32 className="text-yellow-700 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-center text-lg font-semibold">Please check token liquidity</h1>
            <p className="text-gray-500 text-center text-md">
              You must ensure the DAO has enough token liquidity before issuing more iouTokens
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="cancel" fullWidth onClick={() => setOpenedAlert(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={() => closeAlert()}>
              All set
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={openedBurn} onClose={() => setOpenedBurn(false)} title="Burn iouTODO">
        <div className="space-y-5 mt-5">
          <Input
            id="burn"
            placeholder="Burn amount"
            label="The tokens will be burned and cease to exist."
            className="w-full"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedBurn(false)}>
              Cancel
            </Button>
            <Button>Burn</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={openedIssue} onClose={() => setOpenedIssue(false)} title="Issue iouTODO">
        <div className="space-y-5 mt-5">
          <Input
            placeholder="Issue amount"
            label="The tokens will be created and start circulating."
            className="w-full"
          />
          <div className="bg-amber-200/10 flex items-center rounded-md p-2">
            <WarningAltFilled16 className="text-yellow-700 mx-2" />
            <p className="text-yellow-700 text-sm">Ensure there is enough token liquidity before issuing</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedIssue(false)}>
              Cancel
            </Button>
            <Button>Issue</Button>
          </div>
        </div>
      </Modal>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <SortButton title="Name" label="todo" />
        <SortButton title="Circulating" label="todo" />
        <SortButton title="Burned" label="todo" />
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {iouTokens.map((t: { id: string; name: string }) => {
          return (
            <Card asChild key={t.id}>
              <div
                // On mobile, two column grid with "labels". On desktop hide the "labels".
                className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center px-3 py-5"
                key={t.id}
              >
                <div className="lg:hidden">Name</div>
                <p>{t.name}</p>
                <div className="lg:hidden">Circulating</div>
                <p>1000</p>
                <div className="lg:hidden">Burned</div>
                <p>1000</p>
                <div className="flex flex-wrap gap-2 lg:col-span-3 justify-end">
                  <Button onClick={() => setOpenedBurn(true)} variant="cancel">
                    Burn
                  </Button>
                  <Button onClick={() => setOpenedAlert(true)}>Issue</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
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
