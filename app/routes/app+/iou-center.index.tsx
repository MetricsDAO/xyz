import { ExclamationTriangleIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import type { BigNumber } from "ethers";
import { ethers } from "ethers";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm } from "remix-validated-form";
import { useAccount } from "wagmi";
import { z } from "zod";
import { iouTokenAbi } from "~/abi/iou-token";
import { Error } from "~/components";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Checkbox } from "~/components/checkbox";
import { Combobox } from "~/components/combobox";
import { Input } from "~/components/input";
import { Modal } from "~/components/modal";
import { Select } from "~/components/select";
import { Header, Row, Table } from "~/components/table";
import { EvmAddressSchema } from "~/domain/address";
import type { IOUToken } from "~/domain/treasury";
import { IOUIssueTokenCreator } from "~/features/iou-issue-token-creator";
import { nodeProvider } from "~/services/node.server";
import { fetchIouTokenMetadata, getMintSignature } from "~/services/treasury.server";

const IssueFormSchema = z.object({
  amount: z.string(),
  recipient: EvmAddressSchema,
  iouContractAddress: EvmAddressSchema,
});

const IssueFormValidator = withZod(IssueFormSchema);

type IssueForm = z.infer<typeof IssueFormSchema>;

export const loader = async ({ params }: DataFunctionArgs) => {
  const iouTokens = await fetchIouTokenMetadata();

  return typedjson({ iouTokens }, { status: 200 });
};

type ActionResponse = typeof action;
export async function action({ request }: ActionArgs) {
  const formData = await IssueFormValidator.validate(await request.formData());
  if (formData.data) {
    const { iouContractAddress, recipient, amount } = formData.data;
    const contract = new ethers.Contract(iouContractAddress, iouTokenAbi, nodeProvider);
    const nonce: BigNumber = await contract.nonces(recipient);
    const res = await getMintSignature({
      source: iouContractAddress,
      to: recipient,
      amount,
      nonce: nonce.toString(),
    });
    return typedjson({ ok: true, data: res });
  }
  return typedjson({ ok: false, data: null });
}

export default function IOUTab() {
  const { iouTokens } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();

  return (
    <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 gap-x-5">
      {/* This data should be set if we got actionData.ok response */}
      {actionData?.ok && actionData?.data && (
        <IOUIssueTokenCreator
          source={actionData.data.signedBody.source}
          amount={actionData.data.signedBody.amount}
          to={actionData.data.signedBody.to}
          expiry={actionData.data.signedBody.expiration}
          nonce={actionData.data.signedBody.nonce}
          signature={actionData.data.signature as `0x${string}`} //should be a 0xstring
          startTransaction={true}
        />
      )}
      <main className="flex-1 space-y-4">
        <IOUListView iouTokens={iouTokens.metadata} />
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
      <Input
        placeholder="Search"
        name="q"
        iconRight={<MagnifyingGlassIcon className="ml-2 h-5 w-5 text-stone-500" />}
      />
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

function IOUListView({ iouTokens }: { iouTokens: IOUToken[] }) {
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

function IOUTable({ iouTokens }: { iouTokens: IOUToken[] }) {
  return (
    <Table>
      <Header columns={6} className="text-xs text-gray-500 font-medium mb-2">
        <Header.Column>Name</Header.Column>
        <Header.Column>Fireblocks</Header.Column>
        <Header.Column>Balance</Header.Column>
      </Header>
      {iouTokens.map((t) => {
        return (
          <Row key={t.id} columns={6}>
            <Row.Column>{t.tokenName}</Row.Column>
            <Row.Column>{t.fireblocksTokenName}</Row.Column>
            <Row.Column span={2}>{t.balance}</Row.Column>
            <Row.Column span={2} className="flex flex-wrap gap-2 justify-end">
              <BurnButton disabled={true} />
              <IssueButton token={t} />
            </Row.Column>
          </Row>
        );
      })}
    </Table>
  );
}

function IOUCards({ iouTokens }: { iouTokens: IOUToken[] }) {
  return (
    <div className="space-y-3">
      {iouTokens.map((t) => {
        return (
          <Card key={t.id} className="grid grid-cols-2 gap-y-3 gap-x-1 items-center px-3 py-5">
            <div>Name</div>
            <p>{t.tokenName}</p>
            <div>Circulating</div>
            <p>{t.balance}</p>
            <div>Fireblocks</div>
            <p>{t.fireblocksTokenName}</p>
            <div className="flex flex-wrap col-span-2 gap-2 justify-center">
              <BurnButton disabled={true} />
              <IssueButton token={t} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function BurnButton({ disabled }: { disabled: boolean }) {
  const [openedBurn, setOpenedBurn] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenedBurn(true)} variant="cancel" disabled={disabled}>
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

type ModalState = "closed" | "alert" | "issue-metadata";
function IssueButton({ token }: { token: IOUToken }) {
  const [modalState, setModalState] = useState<ModalState>("closed");

  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);

  const { address } = useAccount();
  const formMethods = useForm<IssueForm>({
    resolver: zodResolver(IssueFormSchema),
    defaultValues: {
      recipient: address,
      iouContractAddress: token.contractAddress,
    },
  });

  return (
    <>
      <Button onClick={() => setModalState("alert")}>Issue</Button>
      <Modal isOpen={modalState !== "closed"} onClose={() => setModalState("closed")} title="Issue IOU">
        <>
          {modalState === "alert" && (
            <div className="mx-auto space-y-7">
              <ExclamationTriangleIcon className="text-yellow-700 mx-auto h-5 w-5" />
              <div className="space-y-2">
                <h1 className="text-center text-lg font-semibold">Please check token liquidity</h1>
                <p className="text-gray-500 text-center text-md">
                  You must ensure the DAO has enough token liquidity before issuing more iouTokens
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="cancel" fullWidth onClick={() => setModalState("closed")}>
                  Cancel
                </Button>
                <Button fullWidth onClick={() => setModalState("issue-metadata")}>
                  All set
                </Button>
              </div>
            </div>
          )}

          {modalState === "issue-metadata" && (
            <form
              ref={formRef}
              className="space-y-5 mt-5"
              onSubmit={formMethods.handleSubmit((data) => {
                submit(formRef.current, { method: "post", action: "/app/iou-center?index" });
                setModalState("closed");
              })}
            >
              <div className="space-y-5 mt-5">
                <Input
                  {...formMethods.register("amount")}
                  placeholder="Issue amount"
                  label="The tokens will be created and start circulating."
                  className="w-full"
                />
                <input {...formMethods.register("iouContractAddress")} type="hidden" />
                <Error error={formMethods.formState.errors.amount?.message} />
                <Input {...formMethods.register("recipient")} placeholder="Recepient address" className="w-full" />
                <Error error={formMethods.formState.errors.recipient?.message} />
                <div className="bg-amber-200/10 flex items-center rounded-md p-2">
                  <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5" />
                  <p className="text-yellow-700 text-sm">Ensure there is enough token liquidity before issuing</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="cancel" onClick={() => setModalState("closed")}>
                    Cancel
                  </Button>
                  <Button type="submit">Issue</Button>
                </div>
              </div>
            </form>
          )}
        </>
      </Modal>
    </>
  );
}
