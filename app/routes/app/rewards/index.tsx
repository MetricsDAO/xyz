import {
  CheckboxCheckedFilled16,
  WarningSquareFilled16,
  ChevronSort16,
  ChevronSortDown16,
  ChevronSortUp16,
  Search16,
} from "@carbon/icons-react";
import {
  Input,
  Title,
  Text,
  Button,
  Tabs,
  Avatar,
  MultiSelect,
  Pagination,
  Checkbox,
  UnstyledButton,
  Modal,
  Center,
  Menu,
} from "@mantine/core";
import { Form, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ProjectBadge, TextWithIcon } from "~/components/ProjectBadge";
import { useState } from "react";
import { PROJECT_ICONS } from "~/utils/helpers";

export default function Rewards() {
  const [activeTab, setActiveTab] = useState<string | null>("rewards");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openedAdd, setOpenedAdd] = useState(false);

  const onPaginationChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  //to be replaced
  const rewards = [{ id: 123, title: "silly string" }];
  const addresses = [{ id: 123, title: "silly string" }];
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
      <Modal opened={openedAdd} onClose={() => setOpenedAdd(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}>Add an address</Title>
          <div className="space-y-2">
            <div className="flex border-solid border rounded-md border-[#DEDEDE]">
              <Menu position="top-start" offset={0}>
                <Menu.Target>
                  <UnstyledButton>
                    <ChevronSortDown16 className="m-3" />
                  </UnstyledButton>
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
                          <Text>{c.name}</Text>
                          <Text size="xs" color="dimmed">
                            {c.subtext}
                          </Text>
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
                <Input variant="unstyled" placeholder="Select a chain and enter an address" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button radius="md" variant="default" onClick={() => setOpenedAdd(false)}>
              Cancel
            </Button>
            <Button radius="md" disabled={!validAddress}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <div className="mx-auto container mb-12 px-10 space-y-16">
        {activeTab === "rewards" ? (
          <section className="space-y-2 max-w-3xl">
            <Title order={2} weight={600}>
              Rewards
            </Title>
            <div>
              <Title order={4} color="brand.4" weight={400}>
                Claim reward tokens for all the challenges you’ve won
              </Title>
              <Text color="dimmed">View all your pending and claimed rewards and manage all your payout addresses</Text>
            </div>
          </section>
        ) : (
          <div>
            <section className="flex flex-wrap gap-5 justify-between pb-2">
              <Title order={2} weight={600}>
                Manage Addresses
              </Title>
              <Center className="flex flex-wrap gap-5">
                <Button radius="md" className="mx-auto" onClick={() => setOpenedAdd(true)}>
                  Add Address
                </Button>
              </Center>
            </section>
            <section className="max-w-3xl">
              <Title order={4} color="brand.4" weight={400}>
                Manage all your payout addresses to receive reward tokens
              </Title>
              <Text color="dimmed">
                Reward tokens will automatically be sent to these wallets when you claim rewards
              </Text>
            </section>
          </div>
        )}

        <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
          <main className="flex-1">
            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List className="mb-5">
                <Tabs.Tab value="rewards">My Rewards (3)</Tabs.Tab>
                <Tabs.Tab value="addresses">Payout Addresses (23)</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="rewards" pt="xs">
                <section className="flex flex-col-reverse md:flex-row space-y-reverse space-y-7 md:space-y-0 space-x-0 md:space-x-5">
                  <main className="flex-1">
                    <div className="space-y-5">
                      <RewardsTable rewards={rewards} />
                      <div className="w-fit m-auto">
                        <Pagination
                          page={params.page}
                          hidden={totalResults === 0}
                          total={Math.ceil(totalResults / params.first)}
                          onChange={onPaginationChange}
                        />
                      </div>
                    </div>
                  </main>
                  <aside className="md:w-1/5">
                    <SearchAndFilter />
                  </aside>
                </section>
              </Tabs.Panel>

              <Tabs.Panel value="addresses" pt="xs">
                <PayoutAddresses addresses={addresses} />
              </Tabs.Panel>
            </Tabs>
          </main>
        </section>
      </div>
    </>
  );
}

function SearchAndFilter() {
  return (
    <Form className="space-y-3 p-3 border-[1px] border-solid border-[#EDEDED] rounded-md bg-brand-400 bg-opacity-5">
      <Input placeholder="Search" name="q" radius="md" rightSection={<Search16 />} />
      <Text size="lg" weight={600}>
        Filter:
      </Text>
      <Checkbox.Group label="Status" spacing="xs">
        <Checkbox value="unclaimed" label="Unclaimed" />
        <Checkbox value="claimed" label="Claimed" />
      </Checkbox.Group>
      <MultiSelect
        radius="md"
        label="Reward Token"
        placeholder="Select option"
        name="rewardToken"
        clearable
        data={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
          { label: "USD", value: "USD" },
        ]}
      />
      <MultiSelect
        radius="md"
        label="Challenge Marketplace"
        placeholder="Select option"
        name="challengeMarketplace"
        clearable
        data={[
          { label: "Solana", value: "Solana" },
          { label: "Ethereum", value: "Ethereum" },
        ]}
      />
    </Form>
  );
}

function PayoutAddresses({ addresses }: { addresses: any }) {
  const [openedUpdate, setOpenedUpdate] = useState(false);
  const [openedRemove, setOpenedRemove] = useState(false);

  const validAddress = false;
  const minInput = true;

  return (
    <>
      <Modal opened={openedUpdate} onClose={() => setOpenedUpdate(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}>Update address</Title>
          <div className="space-y-2">
            <div className="flex border-solid border rounded-md border-[#DEDEDE]">
              <Text size="sm" weight={600} className="border-solid border-0 border-r border-[#DEDEDE] p-3">
                SOL
              </Text>
              <div className="flex items-center ml-2">
                {minInput ? (
                  validAddress ? (
                    <CheckboxCheckedFilled16 className="mr-1 text-[#68C132]" />
                  ) : (
                    <WarningSquareFilled16 className="mr-1 text-[#EC5962]" />
                  )
                ) : (
                  <></>
                )}
                <Input variant="unstyled" placeholder="Update address" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button radius="md" variant="default" onClick={() => setOpenedUpdate(false)}>
              Cancel
            </Button>
            <Button radius="md" disabled={!validAddress}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={openedRemove} onClose={() => setOpenedRemove(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}>Are you sure you want to remove?</Title>
          <div className="space-y-2">
            <div className="flex border-solid border rounded-md border-[#DEDEDE] items-center">
              <Text size="sm" weight={600} className="border-solid border-0 border-r border-[#DEDEDE] p-3">
                SOL
              </Text>
              <Text className="pl-2">0x381764734678365783648</Text>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button radius="md" variant="default" onClick={() => setOpenedRemove(false)}>
              Cancel
            </Button>
            <Button radius="md">Remove</Button>
          </div>
        </div>
      </Modal>
      <section>
        {/* Header (hide on mobile) */}
        <div className="hidden lg:grid grid-cols-5 gap-x-1 items-end px-2">
          <SortButton title="Chain/Project" label="todo" />
          <div className="col-span-2">
            <SortButton title="Address" label="todo" />
          </div>
          <SortButton title="Last Updated" label="todo" />
        </div>
        {/* Rows */}
        <div className="space-y-3">
          {addresses.map((a: { id: string }) => {
            return (
              <div
                // On mobile, two column grid with "labels". On desktop hide the "labels".
                className="grid grid-cols-2 lg:grid-cols-5 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
                key={a.id}
              >
                <div className="lg:hidden">Chain/Project</div>
                <ProjectBadge key={a.id} slug={"Solana"} />
                <div className="lg:hidden">Address</div>
                <div className="lg:col-span-2">
                  <Text color="dark.3">{`TODO`} </Text>
                </div>
                <div className="lg:hidden">Last Updated</div>
                <Text color="dark.3">{formatTime("1999-01-01")} </Text>
                <div className="lg:hidden">""</div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" radius="md" onClick={() => setOpenedRemove(true)}>
                    Remove
                  </Button>
                  <Button variant="default" radius="md" onClick={() => setOpenedUpdate(true)}>
                    Update
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// Responsive layout for displaying marketplaces. On desktop, takes on a pseudo-table layout. On mobile, hide the header and become a list of self-contained cards.
function RewardsTable({ rewards }: { rewards: any }) {
  const [opened, setOpened] = useState(false);
  if (rewards.length === 0) {
    return <Text>No results. Try changing search and filter options.</Text>;
  }
  const unclaimed = true;
  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} withCloseButton={false}>
        <div className="space-y-5">
          <Title order={4}> Claim your reward!</Title>
          <div className="space-y-2">
            <div className="flex items-center">
              <Avatar src="/img/trophy.svg" className="mr-2" />
              <Text color="#946100" size={28}>
                10 SOL
              </Text>
            </div>
            <div className="flex border-solid border rounded-md border-[#DEDEDE]">
              <Text size="sm" weight={600} className="border-solid border-0 border-r border-[#DEDEDE] p-3">
                SOL
              </Text>
              <div className="flex items-center p-3">
                <CheckboxCheckedFilled16 className="mr-1 text-[#68C132]" />
                <Text size="sm" color="dimmed">
                  0xs358437485395889094
                </Text>
              </div>
            </div>
            <Text size="xs">To chage or update this address head to Payout Addresses</Text>
          </div>
          <div className="flex gap-2 justify-end">
            <Button radius="md" variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button radius="md">Claim</Button>
          </div>
        </div>
      </Modal>
      {/* Header (hide on mobile) */}
      <div className="hidden lg:grid grid-cols-6 gap-x-1 items-end px-2">
        <div className="col-span-2">
          <SortButton title="Challenge Title" label="todo" />
        </div>
        <SortButton title="Reward" label="todo" />
        <SortButton title="Submitted" label="todo" />
        <SortButton title="Rewarded" label="todo" />
        <SortButton title="Status" label="todo" />
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {rewards.map((r: { id: string; title: string }) => {
          return (
            <div
              // On mobile, two column grid with "labels". On desktop hide the "labels".
              className="grid grid-cols-2 lg:grid-cols-6 gap-y-3 gap-x-1 items-center border-solid border-2 border-[#EDEDED] px-2 py-5 rounded-lg hover:border-brand-400 hover:shadow-md shadow-sm"
              key={r.id}
            >
              <div className="lg:hidden">Challenge Title</div>
              <div className="lg:col-span-2">
                <Text>{r.title}</Text>
              </div>
              <div className="lg:hidden">Reward</div>
              <TextWithIcon iconUrl={"/img/icons/project-icons/sol.svg"} text="20 SOL" />
              <div className="lg:hidden">Submitted</div>
              <Text color="dark.3">{formatTime("2022-01-01")} </Text>
              <div className="lg:hidden">Rewarded</div>
              <Text color="dark.3">{formatTime("2022-11-01")} </Text>
              <div className="lg:hidden">Status</div>
              {unclaimed ? (
                <Button onClick={() => setOpened(true)}>Claim</Button>
              ) : (
                <Button variant="default">View Tx</Button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function formatTime(time: string | number | Date) {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
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
    <UnstyledButton onClick={() => onSort(label)} className="flex">
      <Text color="dark.3">{title}</Text>
      {searchParams.get("sortBy") === label ? (
        searchParams.get("order") === "asc" ? (
          <ChevronSortUp16 className="mt-2" />
        ) : (
          <ChevronSortDown16 />
        )
      ) : (
        <ChevronSort16 className="mt-1" />
      )}
    </UnstyledButton>
  );
}
