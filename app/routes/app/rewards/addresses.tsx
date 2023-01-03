import { CheckCircleIcon, ClipboardDocumentIcon, XCircleIcon } from "@heroicons/react/20/solid";
import type { Network, Wallet } from "@prisma/client";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { redirect, typedjson, useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { useIsValid, ValidatedForm, validationError } from "remix-validated-form";
import { ValidatedInput } from "~/components";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Container } from "~/components/container";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
import { Modal } from "~/components/modal";
import { Header, Row, Table } from "~/components/table";
import { WalletUpdateSchema, WalletAddSchema, WalletDeleteSchema } from "~/domain/wallet";
import { AddPaymentAddressForm } from "~/features/add-payment-address-form";
import RewardsTab from "~/features/rewards-tab";
import { listNetworks } from "~/services/network.server";
import { getUserId } from "~/services/session.server";
import { listTokens } from "~/services/tokens.server";
import {
  addWalletAddress,
  deleteWalletAddress,
  findAllWalletsForUser,
  updateWalletAddress,
  walletExists,
} from "~/services/wallet.server";
import { fromNow } from "~/utils/date";
import { truncateAddress } from "~/utils/helpers";
import { namedAction } from "remix-utils";
import invariant from "tiny-invariant";
import { logger } from "ethers";

type ActionResponse = { wallet: Wallet } | ValidationErrorResponseData;

export async function action({ request }: ActionArgs) {
  const user = await getUserId(request);
  invariant(user, "You must be logged in to add a wallet");

  return namedAction(request, {
    async create() {
      const formData = await addWalletValidator.validate(await request.formData());
      if (formData.error) return validationError(formData.error);

      const exists = await walletExists(formData.data.payment.address);

      if (exists != null) {
        return typedjson({ addError: { message: "Wallet already exists" } });
      }
      const wallet = await addWalletAddress(user, formData.data);
      return typedjson({ wallet });
    },
    async update() {
      const formData = await updateWalletValidator.validate(await request.formData());
      if (formData.error) return validationError(formData.error);

      const exists = await walletExists(formData.data.payment.address);

      if (exists != null) {
        return typedjson({ updateError: { message: "Wallet already exists" } });
      }
      const wallet = await updateWalletAddress(user, formData.data);

      return typedjson({ wallet });
    },
    async delete() {
      const formData = await deleteWalletValidator.validate(await request.formData());
      if (formData.error) return validationError(formData.error);

      await deleteWalletAddress(formData.data);
      return redirect("/app/rewards/addresses");
    },
  });
}

export const loader = async (data: DataFunctionArgs) => {
  const user = await getUserId(data.request);
  const wallets = user ? await findAllWalletsForUser(user) : [];
  const tokens = await listTokens();
  const networks = await listNetworks();

  return typedjson({
    tokens,
    networks,
    wallets,
    user,
  });
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

function AddressTable({
  wallets,
}: {
  wallets: (Wallet & {
    chain: Network;
  })[];
}) {
  return (
    <Table>
      <Header columns={12}>
        <Header.Column span={2}>Chain/Project</Header.Column>
        <Header.Column span={5}>Address</Header.Column>
        <Header.Column span={2}>Last Updated</Header.Column>
      </Header>
      {wallets.map((wallet) => {
        return (
          <Row columns={12} key={wallet.address}>
            <Row.Column span={2}>project</Row.Column>
            <Row.Column span={5} className="flex flex-row items-center gap-x-2">
              <CopyToClipboard
                className="text-black"
                content={truncateAddress(wallet.address)}
                iconRight={<ClipboardDocumentIcon className="ml-0.5 h-5 w-5" />}
              />
            </Row.Column>
            <Row.Column span={2} className="text-black">
              {fromNow(wallet.createdAt)}
            </Row.Column>
            <Row.Column span={3} className="flex flex-wrap gap-2">
              <RemoveAddressButton wallet={wallet} />
              <UpdateAddressButton wallet={wallet} />
            </Row.Column>
          </Row>
        );
      })}
    </Table>
  );
}

function AddressCards({
  wallets,
}: {
  wallets: (Wallet & {
    chain: Network;
  })[];
}) {
  return (
    <div className="space-y-3">
      {wallets.map((wallet) => {
        return (
          <Card
            // On mobile, two column grid with "labels". On desktop hide the "labels".
            className="grid grid-cols-2 lg:grid-cols-5 gap-y-3 gap-x-1 items-center px-2 py-5"
            key={wallet.address}
          >
            <div className="lg:hidden">Chain/Project</div>
            <p>project</p>
            <div className="lg:hidden">Address</div>
            <div className="lg:col-span-2 flex flex-row items-center gap-x-2">
              <p className="text-black">{truncateAddress(wallet.address)}</p>
              <ClipboardDocumentIcon className="ml-0.5 h-5 w-5" />
            </div>
            <div className="lg:hidden">Last Updated</div>
            <p className="text-black">{fromNow(wallet.createdAt)} </p>
            <div className="flex flex-wrap gap-2">
              <RemoveAddressButton wallet={wallet} />
              <UpdateAddressButton wallet={wallet} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export const addWalletValidator = withZod(WalletAddSchema);
export const deleteWalletValidator = withZod(WalletDeleteSchema);
export const updateWalletValidator = withZod(WalletUpdateSchema);

function AddAddressButton() {
  const { networks } = useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<ActionResponse>();
  const [openedAdd, setOpenedAdd] = useState(false);

  useEffect(() => {
    if (actionData && "wallet" in actionData) {
      setOpenedAdd(false);
    } else if (actionData && "addError" in actionData) {
      logger.info("Wallet already exists");
    }
  }, [actionData]);

  return (
    <>
      <Button className="mx-auto" onClick={() => setOpenedAdd(true)}>
        Add Address
      </Button>
      <Modal isOpen={openedAdd} onClose={() => setOpenedAdd(false)} title="Add an address">
        <ValidatedForm
          defaultValues={{
            payment: {
              networkName: "Ethereum",
              address: "",
            },
          }}
          method="post"
          action="?/create"
          name="create"
          validator={addWalletValidator}
          className="space-y-5 mt-5"
        >
          <div className="pb-44 pt-8">
            <AddPaymentAddressForm networks={networks} />
            {actionData && "addError" in actionData && <p className=" text-red-500">{"This wallet already exists."}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedAdd(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </ValidatedForm>
      </Modal>
    </>
  );
}

function RemoveAddressButton({ wallet }: { wallet: Wallet & { chain: Network } }) {
  const [openedRemove, setOpenedRemove] = useState(false);

  return (
    <>
      <Button variant="cancel" onClick={() => setOpenedRemove(true)}>
        Remove
      </Button>
      <Modal isOpen={openedRemove} onClose={() => setOpenedRemove(false)} title="Are you sure you want to remove?">
        <div className="space-y-5 mt-5">
          <div className="flex border-solid border rounded-md border-trueGray-200 items-center">
            <p className="text-sm font-semibold border-solid border-0 border-r border-trueGray-200 p-3">
              {wallet.networkName}
            </p>
            <p className="pl-2 overflow-clip">{wallet.address}</p>
          </div>
          <ValidatedForm method="post" action="?/delete" validator={deleteWalletValidator} className="space-y-5 mt-5">
            <div className="invisible h-0 w-0">
              <ValidatedInput type="hidden" id="currentAddress" name="currentAddress" value={wallet.address} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="cancel" onClick={() => setOpenedRemove(false)}>
                Cancel
              </Button>
              <Button type="submit">Remove</Button>
            </div>
          </ValidatedForm>
        </div>
      </Modal>
    </>
  );
}

function UpdateAddressButton({
  wallet,
}: {
  wallet: Wallet & {
    chain: Network;
  };
}) {
  const [openedUpdate, setOpenedUpdate] = useState(false);

  const actionData = useTypedActionData<ActionResponse>();

  useEffect(() => {
    if (actionData && "wallet" in actionData) {
      setOpenedUpdate(false);
    } else if (actionData && "updateError" in actionData) {
      logger.info("Wallet already exists");
    }
  }, [actionData]);

  const isValid = useIsValid("update");
  return (
    <>
      <Button variant="primary" onClick={() => setOpenedUpdate(true)}>
        Update
      </Button>
      <Modal isOpen={openedUpdate} onClose={() => setOpenedUpdate(false)} title="Update address">
        <ValidatedForm id="update" method="post" action="?/update" validator={updateWalletValidator}>
          <div className="space-y-5 mt-5">
            <div className="space-y-2">
              <div className="flex border-solid border rounded-md border-trueGray-200">
                <p className="text-sm font-semibold border-solid border-0 border-r border-trueGray-200 p-3">
                  {wallet.networkName}
                </p>
                <div className="flex items-center ml-2 w-full">
                  <div>
                    {isValid ? (
                      <CheckCircleIcon className="mr-1 text-lime-500 h-5 w-5" />
                    ) : (
                      <XCircleIcon className="mr-1 text-rose-500 h-5 w-5" />
                    )}
                  </div>
                  <div className="invisible h-0 w-0">
                    <ValidatedInput type="hidden" id="currentAddress" name="currentAddress" value={wallet.address} />
                    <ValidatedInput type="hidden" name="payment.networkName" value={wallet.networkName} />
                  </div>
                  <input
                    className="border-none w-full outline-none"
                    name="payment.address"
                    placeholder="Update Address"
                  />
                </div>
              </div>
              {isValid ? null : <p className="text-red-500">{`Please enter a valid ${wallet.networkName} address.`}</p>}
              {actionData && "updateError" in actionData && (
                <p className=" text-red-500">{"This wallet already exists."}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="cancel" onClick={() => setOpenedUpdate(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </ValidatedForm>
      </Modal>
    </>
  );
}
