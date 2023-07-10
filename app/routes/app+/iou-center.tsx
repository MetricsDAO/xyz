import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import type { Network } from "@prisma/client";
import { Outlet } from "@remix-run/react";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Field, Label } from "~/components";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Input } from "~/components/input";
import { Modal } from "~/components/modal";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { IOUCreator } from "~/features/iou-creator/iou-creator";
import { listNetworks } from "~/services/network.server";
import { requireUser } from "~/services/session.server";
import { fetchIouTokenMetadata } from "~/services/treasury.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await requireUser(request, "/app/login?redirectto=app/iou-center");
  const iouTokens = await fetchIouTokenMetadata();
  const networks = await listNetworks();
  // if (!user.isAdmin) {
  //   throw forbidden({ error: "User does not have permission" });
  // }

  return typedjson({ iouTokens, networks, user }, { status: 200 });
};

export default function IOUCenter() {
  const { iouTokens, networks } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16 px-10">
      <div className="space-y-2 mb-16">
        <section className="flex flex-wrap gap-5 justify-between">
          <h1 className="text-3xl font-semibold">iouCenter</h1>
          <div className="flex flex-wrap gap-2">
            <IOUCreator networks={networks} />
            <AddTokenButton disabled={false} networks={networks} />
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
