import { CheckboxCheckedFilled16, WarningSquareFilled16, ChevronSortDown16 } from "@carbon/icons-react";
import { Menu } from "@mantine/core";
import { Outlet, useSearchParams } from "@remix-run/react";
import { Modal } from "~/components/modal";
import { Input } from "~/components/Input";
import { Button } from "~/components/button";
import { Avatar } from "~/components/avatar";
import { useState } from "react";
import { PROJECT_ICONS } from "~/utils/helpers";
import { TabNav, TabNavLink } from "~/components/tab-nav";

export default function Rewards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openedAdd, setOpenedAdd] = useState(false);

  //to be replaced
  const activeTab = "rewards";
  const rewards = [{ id: 123, title: "silly string" }];
  const wallets = [
    { address: "0x75638840948190490890", chain: "Ethereum", user: "idk", userId: 22, isConnected: true },
    { address: "0x32849854983758727987", chain: "Ethereum", user: "idk", userId: 22, isConnected: true },
    { address: "0x75638945875290490238", chain: "Solana", user: "idk", userId: 22, isConnected: true },
    { address: "0x32849854983758727987", chain: "Solana", user: "idk", userId: 22, isConnected: true },
  ];
  const totalResults = rewards.length;
  const params = { first: 1, page: 1 };
  const validAddress = false;
  const minInput = true;
  const chains = [
    { name: "Ethereum", subtext: "ETH" },
    { name: "Solana", subtext: "SOL" },
  ];

  return (
    <>
      <Modal isOpen={openedAdd} onClose={() => setOpenedAdd(false)} title="Add an address">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex border-solid border rounded-md border-[#DEDEDE]">
              <Menu position="top-start" offset={0}>
                <Menu.Target>
                  <button>
                    <ChevronSortDown16 className="m-3" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  {chains.map((c) => (
                    <Menu.Item
                      key={c.subtext}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F6F6F6",
                        },
                      }}
                    >
                      <div className="flex">
                        <Avatar size="md" src={PROJECT_ICONS[c.name]}></Avatar>
                        <div className="ml-2">
                          <p>{c.name}</p>
                          <p className="text-gray-600 text-xs">{c.subtext}</p>
                        </div>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
              <div className="flex items-center pl-2 border-solid border-0 border-l border-[#DEDEDE] ">
                {minInput ? (
                  validAddress ? (
                    <CheckboxCheckedFilled16 className="mr-1 text-[#68C132]" />
                  ) : (
                    <WarningSquareFilled16 className="mr-1 text-[#EC5962]" />
                  )
                ) : (
                  <></>
                )}
                <Input placeholder="Select a chain and enter an address" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="cancel" onClick={() => setOpenedAdd(false)}>
              Cancel
            </Button>
            <Button disabled={!validAddress}>Save</Button>
          </div>
        </div>
      </Modal>
      <div className="mx-auto container mb-12 px-10 space-y-16">
        {activeTab === "rewards" ? (
          <section className="space-y-2 max-w-3xl">
            <h1 className="text-3xl font-semibold">Rewards</h1>
            <div>
              <p className="text-lg text-cyan-500">Claim reward tokens for all the challenges you’ve won</p>
              <p className="text-gray-500 text-sm">
                View all your pending and claimed rewards and manage all your payout addresses
              </p>
            </div>
          </section>
        ) : (
          <div>
            <section className="flex flex-wrap gap-5 justify-between pb-2">
              <h1 className="text-3xl font-semibold">Manage Addresses</h1>
              <div className="flex flex-wrap gap-5 items-center">
                <Button className="mx-auto" onClick={() => setOpenedAdd(true)}>
                  Add Address
                </Button>
              </div>
            </section>
            <section className="max-w-3xl">
              <p className="text-lg text-cyan-500">Manage all your payout addresses to receive reward tokens</p>
              <p className="text-gray-500 text-sm">
                Reward tokens will automatically be sent to these wallets when you claim rewards
              </p>
            </section>
          </div>
        )}

        <TabNav className="mb-8">
          <TabNavLink to="" end>
            My Rewards (3)
          </TabNavLink>
          <TabNavLink to="./addresses">Payout Addresses ({wallets.length})</TabNavLink>
        </TabNav>
      </div>
      <Outlet />
    </>
  );
}
