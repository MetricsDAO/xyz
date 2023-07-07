import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import type { Network } from "@prisma/client";
import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { forbidden } from "remix-utils";
import { Field, Label, Select } from "~/components";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Input } from "~/components/input";
import { Modal } from "~/components/modal";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { requireUser } from "~/services/session.server";
import { fetchIouTokenMetadata } from "~/services/treasury.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await requireUser(request, "/app/login?redirectto=app/iou-center");
  const iouTokens = await fetchIouTokenMetadata();
  if (!user.isAdmin) {
    throw forbidden({ error: "User does not have permission" });
  }

  return typedjson({ iouTokens, user }, { status: 200 });
};

export default function IOUCenter() {
  const { iouTokens } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16 px-10">
      <div className="space-y-2 mb-16">
        <section className="flex flex-wrap gap-5 justify-between">
          <h1 className="text-3xl font-semibold">iouCenter</h1>
          <div className="flex flex-wrap gap-2">
            <CreateIOUButton disabled={false} networks={[]} />
            <AddTokenButton disabled={false} networks={[]} />
          </div>
        </section>
        <section className="max-w-3xl">
          <p className="text-lg text-cyan-500">
            Create iouTokens to facilitate multi-chain payouts in partners’ native tokens
          </p>
          <div className="bg-amber-200/10 flex items-center rounded-md p-2 mt-2 w-fit">
            <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5 hidden md:block" />
            <p className="text-yellow-700 mr-2">
              You must ensure the DAO has enough token liquidity before issuing more iouTokens
            </p>
          </div>
          <div className="bg-amber-200/10 flex items-center rounded-md p-2 mt-2 w-fit">
            <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5 hidden md:block" />
            <p className="text-yellow-700 mr-2">iouTokens are not transferable</p>
          </div>
        </section>
      </div>

      <TabNav className="mb-8">
        <TabNavLink to="" end>
          iouTokens ({iouTokens.metadata.length})
        </TabNavLink>
      </TabNav>

      <Outlet />
    </Container>
  );
}

function CreateIOUButton({ disabled, networks }: { disabled: boolean; networks: Network[] }) {
  const [openedCreate, setOpenedCreate] = useState(false);

  const validAddress = false;
  return (
    <>
      <Button onClick={() => setOpenedCreate(true)} disabled={disabled}>
        Create iouToken
      </Button>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Create new iouToken">
        <form className="space-y-5 mt-2">
          <p>The tokens will be created and can then be issued</p>
          <Field>
            <Label>Target Chain</Label>
            <Select
              placeholder="Select a Target Chain"
              onChange={(v) => {}}
              options={networks.map((n) => {
                return { label: n.name, value: n.name };
              })}
            />
          </Field>
          <Field>
            <Label>iouToken Name</Label>
            <Input label="iouToken Name" placeholder="iouToken Name" />
          </Field>
          <Field>
            <Label>Decimals</Label>
            <Input label="Decimals" placeholder="Decimals" />
          </Field>
          <Field>
            <Label>Fireblocks Token Name</Label>
            <Input label="Fireblocks Name" placeholder="Fireblocks Name" />
          </Field>
          <Field>
            <Label>Contract Address</Label>
            <Input label="Contract Address" placeholder="Contract Address" />
          </Field>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
              Cancel
            </Button>
            <Button disabled={!validAddress}>Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function AddTokenButton({ disabled, networks }: { disabled: boolean; networks: Network[] }) {
  const [openedCreate, setOpenedCreate] = useState(false);

  const validAddress = false;
  return (
    <>
      <Button onClick={() => setOpenedCreate(true)} disabled={disabled}>
        Add Token
      </Button>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Add new Token">
        <form>
          <div className="space-y-5 mt-2">
            <div className="bg-amber-200/10 flex items-center rounded-md p-2">
              <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5" />
              <p className="text-yellow-700 text-sm">For tokens on polygon only</p>
            </div>
            <Field>
              <Label>Token Name</Label>
              <Input label="Token Name" placeholder="Token name" />
            </Field>
            <Field>
              <Label>Token Symbol</Label>
              <Input label="Token Symbol" placeholder="Symbol" />
            </Field>
            <Field>
              <Label>Contract Address</Label>
              <Input label="Contract Address" placeholder="contract address" />
            </Field>
            <Field>
              <Label>Decimals</Label>
              <Input label="Decimals" placeholder="decimals" />
            </Field>
            <div className="flex gap-2 justify-end">
              <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
                Cancel
              </Button>
              <Button disabled={!validAddress}>Save</Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
