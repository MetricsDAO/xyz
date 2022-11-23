import { WarningAltFilled16 } from "@carbon/icons-react";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/button";
import { Container } from "~/components/Container";
import { Input } from "~/components/Input";
import { Modal } from "~/components/modal";
import { TabNav, TabNavLink } from "~/components/tab-nav";

export default function IOUCenter() {
  const [openedCreate, setOpenedCreate] = useState(false);

  //to be replaced
  const rewards = [{ id: 123, name: "silly string" }];
  const validAddress = false;

  return (
    <>
      <Modal isOpen={openedCreate} onClose={() => setOpenedCreate(false)} title="Create new iouToken">
        <div className="space-y-5 mt-2">
          <p>The tokens will be created and start circulating</p>
          <Input label="Name the iouToken" placeholder="iouToken name" />
          <Input label="Amount of iouToken" placeholder="Issue amount" />
          <div className="bg-amber-200/10 flex items-center rounded-md p-2">
            <WarningAltFilled16 className="text-yellow-700 mx-2" />
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
      <Container className="py-16">
        <div className="space-y-2 mb-16">
          <section className="flex flex-wrap gap-5 justify-between">
            <h1 className="text-3xl font-semibold">iouCenter</h1>
            <Button onClick={() => setOpenedCreate(true)}>Create iouToken</Button>
          </section>
          <section className="max-w-3xl">
            <p className="text-lg text-cyan-500">
              Create iouTokens to facilitate multi-chain payouts in partners’ native tokens
            </p>
            <div className="bg-amber-200/10 flex items-center rounded-md p-2">
              <WarningAltFilled16 className="text-yellow-700 mx-2" />
              <p className="text-yellow-700">
                You must ensure the DAO has enough token liquidity before issuing more iouTokens
              </p>
            </div>
          </section>
        </div>

        <TabNav className="mb-8">
          <TabNavLink to="" end>
            iouTokens ({rewards.length})
          </TabNavLink>
        </TabNav>

        <Outlet />
      </Container>
    </>
  );
}
