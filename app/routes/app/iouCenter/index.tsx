import { Search16, WarningAltFilled16, WarningAltFilled32 } from "@carbon/icons-react";
import { useRef, useState } from "react";
import { Button } from "~/components/button";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/checkbox";
import { Input } from "~/components/input";
import { Modal } from "~/components/modal";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { Combobox } from "~/components/combobox";
import { Pagination } from "~/components/Pagination";
import { Header, Row, Table } from "~/components/table";
import { Select } from "~/components/Select";

export default function IOUTab() {
  //to be replaced
  const rewards = [{ id: 123, name: "silly string" }];
  const totalResults = rewards.length;
  const params = { first: 1, page: 1 };

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
      <main className="flex-1 space-y-4">
        <IOUListView iouTokens={rewards} />
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
      <h3 className="font-semibold text-lg">Sort:</h3>
      <Select
        placeholder="Select option"
        name="sortBy"
        options={[
          { label: "None", value: "none" },
          { label: "Chain/Project", value: "project" },
        ]}
      />
      <p className="text-lg font-semibold">Filter</p>
      <Checkbox value="noBalance" label="No available balance" />
      <Combobox
        placeholder="Select option"
        options={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
    </ValidatedForm>
  );
}

function IOUListView({ iouTokens }: { iouTokens: any }) {
  if (iouTokens.length === 0) {
    return (
      <div className="flex py-16">
        <p className="mx-auto text-gray-500">No iouTokens circulating</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <IOUTable iouTokens={iouTokens} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <IOUCards iouTokens={iouTokens} />
      </div>
    </>
  );
}

function IOUTable({ iouTokens }: { iouTokens: any }) {
  return (
    <Table>
      <Header columns={6} className="mb-2">
        <Header.Column>Name</Header.Column>
        <Header.Column>Circulating</Header.Column>
        <Header.Column>Burned</Header.Column>
      </Header>
      {iouTokens.map((t: { id: string; name: string }) => {
        return (
          <Row key={t.id} columns={6}>
            <Row.Column>{t.name}</Row.Column>
            <Row.Column>1000</Row.Column>
            <Row.Column>1000</Row.Column>
            <Row.Column span={3} className="flex flex-wrap gap-2 justify-end">
              <BurnButton />
              <IssueButton />
            </Row.Column>
          </Row>
        );
      })}
    </Table>
  );
}

function IOUCards({ iouTokens }: { iouTokens: any }) {
  return (
    <div className="space-y-3">
      {iouTokens.map((t: { id: string; name: string }) => {
        return (
          <Card key={t.id} className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-3 py-5">
            <div>Name</div>
            <p>{t.name}</p>
            <div>Circulating</div>
            <p>1000</p>
            <div>Burned</div>
            <p>1000</p>
            <div className="flex flex-wrap col-span-2 gap-2 justify-center">
              <BurnButton />
              <IssueButton />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BurnButton() {
  const [openedBurn, setOpenedBurn] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenedBurn(true)} variant="cancel">
        Burn
      </Button>
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
    </>
  );
}

function IssueButton() {
  const [openedAlert, setOpenedAlert] = useState(false);
  const [openedIssue, setOpenedIssue] = useState(false);

  function closeAlert() {
    setOpenedAlert(false);
    setOpenedIssue(true);
  }

  return (
    <>
      <Button onClick={() => setOpenedAlert(true)}>Issue</Button>
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
    </>
  );
}
