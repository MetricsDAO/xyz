import { CheckboxCheckedFilled16, Copy16, WarningSquareFilled16 } from "@carbon/icons-react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import { Container } from "~/components/container";
import RewardsTab from "~/features/rewards-tab";
import { Card } from "~/components/card";
import { fromNow } from "~/utils/date";
import { Header, Row, Table } from "~/components/table";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { listTokens } from "~/services/tokens.server";
import type { ActionFunction, DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { AddPaymentAddressForm } from "~/features/add-payment-address-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { EthAddressSchema, SolAddressSchema } from "~/domain/address";
import { getUserId } from "~/services/session.server";
import {
  addWalletAddress,
  deleteWalletAddress,
  findAllWalletsForUser,
  findBlockchainOfWallet,
  updateWalletAddress,
} from "~/services/wallet.server";
import { redirect } from "@remix-run/node";
import { Input, ValidatedInput } from "~/components";
import type { ActionFunctionArgs } from "@remix-run/server-runtime/dist/router";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const formData = await validator.validate(await request.formData());
  if (formData.error) return validationError(formData.error);

  console.log("formData", formData);

  const token = formData.data.payment.tokenSymbol;
  const address = formData.data.payment.address;
  const user = formData.data.userId;
  const payableBlockchain = await findBlockchainOfWallet(token);
  const actionType = formData.data.action;
  console.log("actionType", actionType);

  if (payableBlockchain && actionType == "add") {
    console.log("ADD");
    await addWalletAddress(address, payableBlockchain.id, user);
  } else if (payableBlockchain && actionType == "remove") {
    console.log("REMOVE");
    await deleteWalletAddress(address);
  } else if (actionType == "update") {
    console.log("UPDATE");
    // await updateWalletAddress(user, address, newAddress);
  }

  return redirect("/app/rewards/addresses");
};

export const loader = async (data: DataFunctionArgs) => {
  const user = await getUserId(data.request);
  const wallets = user ? await findAllWalletsForUser(user) : [];
  const tokens = await listTokens();
  return typedjson(
    {
      tokens,
      wallets,
      user,
    },
    { status: 200 }
  );
};

export default function PayoutAddresses() {
  const { wallets } = useTypedLoaderData<typeof loader>();

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
      <RewardsTab rewardsNum={10} addressesNum={wallets ? wallets?.length : 0} />
      <AddressListView wallets={wallets} />
    </Container>
  );
}

function AddressListView({ wallets }: { wallets: any }) {
  if (wallets?.length === 0) {
    return (
      <div className="flex">
        <p className="text-gray-500 mx-auto py-12">Add payout addresses and begin earning!</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <AddressTable wallets={wallets} />
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <AddressCards wallets={wallets} />
      </div>
    </>
  );
}

function AddressTable({ wallets }: { wallets: any }) {
  const validAddress = false;

  return (
    <Table>
      <Header columns={12}>
        <Header.Column span={2}>Chain/Project</Header.Column>
        <Header.Column span={5}>Address</Header.Column>
        <Header.Column span={2}>Last Updated</Header.Column>
      </Header>
      {wallets.map((w: { address: string; chain: string }) => {
        return (
          <Row columns={12} key={w.address}>
            <Row.Column span={2}>project</Row.Column>
            <Row.Column span={5} className="flex flex-row items-center gap-x-2">
              {validAddress ? (
                <CheckboxCheckedFilled16 className="text-lime-500" />
              ) : (
                <WarningSquareFilled16 className="text-rose-500" />
              )}
              <CopyToClipboard className="text-black" content={w.address} iconRight={<Copy16 className="ml-0.5" />} />
            </Row.Column>
            <Row.Column span={2} className="text-black">
              {fromNow("1999-01-01")}
            </Row.Column>
            <Row.Column span={3} className="flex flex-wrap gap-2">
              <RemoveAddressButton />
              <UpdateAddressButton />
            </Row.Column>
          </Row>
        );
      })}
    </Table>
  );
}

function AddressCards({ wallets }: { wallets: any }) {
  const validAddress = false;
  return (
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
              <p className="text-black">
                {w.address.length > 10 ? w.address?.slice(0, 6) + "..." + w.address?.slice(-4) : w.address}
              </p>
              <Copy16 className="ml-0.5" />
            </div>
            <div className="lg:hidden">Last Updated</div>
            <p className="text-black">{fromNow("1999-01-01")} </p>
            <div className="flex flex-wrap gap-2">
              <RemoveAddressButton />
              <UpdateAddressButton />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

const schema = z.object({
  payment: z.discriminatedUnion("tokenSymbol", [
    z.object({ tokenSymbol: z.literal("ETH"), address: EthAddressSchema }),
    z.object({ tokenSymbol: z.literal("SOL"), address: SolAddressSchema }),
    z.object({ tokenSymbol: z.literal("MATIC"), address: EthAddressSchema }),
  ]),
  userId: z.string({ description: "The ID of the user the wallet belongs to." }),
  action: z.string({ description: "The action to perform on the wallet. Either add, update, or remove" }),
});

const validator = withZod(schema);
function AddAddressButton() {
  const { tokens } = useTypedLoaderData<typeof loader>();
  const [openedAdd, setOpenedAdd] = useState(false);

  const { user } = useTypedLoaderData<typeof loader>();
  console.log("user", user);

  return (
    <>
      <Button className="mx-auto" onClick={() => setOpenedAdd(true)}>
        Add Address
      </Button>
      <Modal isOpen={openedAdd} onClose={() => setOpenedAdd(false)} title="Add an address">
        <ValidatedForm action="/app/rewards/addresses" method="post" validator={validator} className="space-y-5 mt-5">
          <div className="pb-44 pt-8">
            <AddPaymentAddressForm tokens={tokens} />
          </div>
          <div className="invisible h-0">
            <ValidatedInput type="hidden" id="userId" name="userId" value={user ? user : ""} />
            <ValidatedInput type="hidden" id="action" name="action" value={"add"} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedAdd(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenedAdd(false)} type="submit">
              Save
            </Button>
          </div>
        </ValidatedForm>
      </Modal>
    </>
  );
}

function RemoveAddressButton() {
  const [openedRemove, setOpenedRemove] = useState(false);
  const { user } = useTypedLoaderData<typeof loader>();

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
          <ValidatedForm action="/app/rewards/addresses" method="post" validator={validator} className="space-y-5 mt-5">
            <div className="invisible h-0">
              <ValidatedInput type="hidden" id="userId" name="userId" value={user ? user : ""} />
              <ValidatedInput type="hidden" id="action" name="action" value={"remove"} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={() => setOpenedRemove(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenedRemove(false)} type="submit">
                Remove
              </Button>
            </div>
          </ValidatedForm>
        </div>
      </Modal>
    </>
  );
}

function UpdateAddressButton() {
  const [openedUpdate, setOpenedUpdate] = useState(false);

  const validAddress = false;
  const { user, tokens } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <Button variant="primary" onClick={() => setOpenedUpdate(true)}>
        Update
      </Button>
      <>
        <Modal isOpen={openedUpdate} onClose={() => setOpenedUpdate(false)} title="Update Address">
          <ValidatedForm action="/app/rewards/addresses" method="post" validator={validator} className="space-y-5 mt-5">
            <div className="pb-44 pt-8">
              <AddPaymentAddressForm tokens={tokens} />
            </div>
            <div className="invisible h-0">
              <ValidatedInput type="hidden" id="userId" name="userId" value={user ? user : ""} />
              <ValidatedInput type="hidden" id="action" name="action" value={"update"} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={() => setOpenedUpdate(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpenedUpdate(false)} type="submit">
                Save
              </Button>
            </div>
          </ValidatedForm>
        </Modal>
      </>
    </>
  );
}
