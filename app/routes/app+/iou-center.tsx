import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { Outlet } from "@remix-run/react";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { forbidden } from "remix-utils";
import { Button } from "~/components/button";
import { Container } from "~/components/container";
import { Input } from "~/components/input";
import { Modal } from "~/components/modal";
import { TabNav, TabNavLink } from "~/components/tab-nav";
import { getIOUTokenData } from "~/domain/reward/functions.server";
import { requireUser } from "~/services/session.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await requireUser(request, "/app/login?redirectto=app/iou-center");
  const iouTokens = await getIOUTokenData();
  if (!user.isAdmin) {
    throw forbidden({ error: "User does not have permission" });
  }

  return typedjson({ iouTokens, user }, { status: 200 });
};

export default function IOUCenter() {
  const { iouTokens, user } = useTypedLoaderData<typeof loader>();

  return (
    <Container className="py-16">
      <div className="space-y-2 mb-16">
        <section className="flex flex-wrap gap-5 justify-between">
          <h1 className="text-3xl font-semibold">iouCenter</h1>
          {/*<CreateIOUButton />*/}
        </section>
        <section className="max-w-3xl">
          <p className="text-lg text-cyan-500">
            Create iouTokens to facilitate multi-chain payouts in partners’ native tokens
          </p>
          <div className="bg-amber-200/10 flex items-center rounded-md p-2">
            <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5" />
            <p className="text-yellow-700">
              You must ensure the DAO has enough token liquidity before issuing more iouTokens
            </p>
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

function CreateIOUButton() {
  const [openedCreate, setOpenedCreate] = useState(false);

  const validAddress = false;
  return (
    <>
      <Button onClick={() => setOpenedCreate(true)}>Create iouToken</Button>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Create new iouToken">
        <div className="space-y-5 mt-2">
          <p>The tokens will be created and start circulating</p>
          <Input label="Name the iouToken" placeholder="iouToken name" />
          <Input label="Amount of iouToken" placeholder="Issue amount" />
          <div className="bg-amber-200/10 flex items-center rounded-md p-2">
            <ExclamationTriangleIcon className="text-yellow-700 mx-2 h-5 w-5" />
            <p className="text-yellow-700 text-sm">Ensure there is enough token liquidity before issuing</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedCreate(false)}>
              Cancel
            </Button>
            <Button disabled={!validAddress}>Save</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
